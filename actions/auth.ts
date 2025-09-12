'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/validations/forms'
import { logWarning } from '@/lib/utils/error-handler'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  // サーバーサイドバリデーション
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string || formData.get('password') as string
  }

  const validation = signupSchema.safeParse(rawData)
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(issue => issue.message).join(', ')
    logWarning(validation.error, 'signup-validation', 'Server-side validation failed')
    throw new Error(errorMessage)
  }

  const validatedData = validation.data

  const data = {
    email: validatedData.email,
    password: validatedData.password,
    options: {
      data: {
        display_name: 'unknown'
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    logWarning(error, 'signup-supabase', 'Supabase signup error')
    throw new Error(error.message)
  }

  redirect('/auth/confirm')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  // サーバーサイドバリデーション
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const validation = loginSchema.safeParse(rawData)
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(issue => issue.message).join(', ')
    logWarning(validation.error, 'login-validation', 'Server-side validation failed')
    throw new Error(errorMessage)
  }

  const validatedData = validation.data

  const { error } = await supabase.auth.signInWithPassword(validatedData)

  if (error) {
    logWarning(error, 'login-supabase', 'Supabase login error')
    throw new Error(error.message)
  }

  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

