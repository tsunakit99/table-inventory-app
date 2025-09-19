'use client'

import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from '@/actions/auth'
import { loginSchema, LoginFormData } from '@/lib/validations/forms'
import { handleFormError } from '@/lib/utils/error-handler'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      await signIn(formData)
    } catch (error) {
      // Next.jsのredirect()はエラーを投げてナビゲーションするため、
      // NEXT_REDIRECTエラーの場合は正常な処理として扱う
      if (error && typeof error === 'object' && 'digest' in error &&
          typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
        console.log('[LOGIN] Redirect successful')
        return
      }
      handleFormError(error, 'login', setError)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0C1E7D' }}>
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <Image
                src="/tableicon.png"
                alt="居食屋 たーぶる"
                width={200}
                height={50}
                className="object-contain w-auto h-[90px] mx-auto mt-4"
                priority
              />
          <p className="mt-10 text-center text-sm text-white">
            アカウントにログイン
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-white">
                メールアドレス
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 text-white"
                placeholder="your@email.com"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-white">
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 text-white"
                placeholder="パスワード"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
          )}

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-700"
            >
              {isSubmitting ? 'ログイン中...' : 'ログイン'}
            </Button>
          </div>
          
          <div className="text-center">
            <a 
              href="/auth/signup" 
              className="text-indigo-600 hover:text-indigo-500 text-sm text-white"
            >
              アカウントを作成→
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
