import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: 認証状態をリフレッシュしてクッキーを更新
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 認証が必要なルート（認証されていない場合はログインページにリダイレクト）
  // /api/send-email のみ認証をスキップ（Edge Functionからのメール送信用）
  if (!user && !request.nextUrl.pathname.startsWith('/auth') && request.nextUrl.pathname !== '/api/send-email') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // 既に認証済みユーザーが認証ページにアクセスした場合はホームにリダイレクト
  if (user && request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.includes('/callback')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - workbox-*.js (PWA files)
     * - manifest.webmanifest (PWA manifest)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|workbox-.*\\.js|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
