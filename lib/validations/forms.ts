import { z } from 'zod'

/**
 * カテゴリ作成フォームのバリデーションスキーマ
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(10, 'カテゴリ名は10文字以内で入力してください')
    .regex(
      /^[\p{L}\p{N}\p{P}\p{S}\s]+$/u,
      '無効な文字が含まれています'
    )
    .transform((val) => val.trim())
})

/**
 * 商品作成フォームのバリデーションスキーマ
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(1, '商品名は必須です')
    .max(20, '商品名は20文字以内で入力してください')
    .regex(
      /^[\p{L}\p{N}\p{P}\p{S}\s]+$/u,
      '無効な文字が含まれています'
    )
    .transform((val) => val.trim()),
  categoryId: z
    .string()
    .min(1, 'カテゴリの選択は必須です')
})

/**
 * チェック作成フォームのバリデーションスキーマ
 */
export const checkSchema = z.object({
  status: z.enum(['YELLOW', 'RED'], { message: '無効なステータスです' }),
  quantity: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const num = parseInt(val, 10)
      return !isNaN(num)
    }, '個数は数値で入力してください')
    .refine((val) => {
      if (!val || val === '') return true
      const num = parseInt(val, 10)
      return num >= 0
    }, '個数は0以上で入力してください')
    .refine((val) => {
      if (!val || val === '') return true
      const num = parseInt(val, 10)
      return num <= 99
    }, '個数は99以下で入力してください')
    .transform((val) => {
      if (!val || val === '') return undefined
      return parseInt(val, 10)
    }),
  note: z
    .string()
    .max(120, '備考は120文字以内で入力してください')
    .optional()
    .transform((val) => val?.trim() || undefined)
})

/**
 * ユーザープロフィール更新のバリデーションスキーマ
 */
export const userProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, '表示名は必須です')
    .max(10, '表示名は10文字以内で入力してください')
    .regex(
      /^[\p{L}\p{N}\s]+$/u,
      '表示名には文字、数字、スペースのみ使用できます'
    )
    .transform((val) => val.trim())
})

/**
 * ログイン用のバリデーションスキーマ
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .min(8, 'パスワードは8文字以上で入力してください')
})

/**
 * サインアップ用のバリデーションスキーマ
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードには小文字、大文字、数字を含めてください'
    ),
  confirmPassword: z
    .string()
    .min(1, 'パスワード確認は必須です')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword']
})

/**
 * ID系のバリデーションスキーマ
 */
export const idSchema = z
  .string()
  .min(1, 'IDは必須です')
  .uuid('無効なID形式です')

// 型定義をエクスポート
export type CategoryFormData = z.infer<typeof categorySchema>
export type ProductFormData = z.infer<typeof productSchema>
export type CheckFormData = z.infer<typeof checkSchema>
export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
