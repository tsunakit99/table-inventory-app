'use client'

import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUp } from '@/actions/auth'
import { signupSchema, SignupFormData } from '@/lib/validations/forms'
import { handleFormError } from '@/lib/utils/error-handler'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('confirmPassword', data.confirmPassword)
      await signUp(formData)
    } catch (error) {
      handleFormError(error, 'signup', setError)
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
            新しいアカウントを作成
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
                placeholder="8文字以上（大文字・小文字・数字を含む）"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                パスワード確認
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="mt-1 text-white"
                placeholder="パスワードを再入力"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
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
              {isSubmitting ? 'アカウント作成中...' : 'アカウント作成'}
            </Button>
          </div>
          
          <div className="text-center">
            <a 
              href="/auth/login" 
              className="text-white hover:text-indigo-500 text-sm"
            >
              既にアカウントをお持ちですか？
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
