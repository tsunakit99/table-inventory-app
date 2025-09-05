'use client'

import { useState, useTransition } from 'react'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, Camera, Edit2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateDisplayName, updateAvatar } from '@/actions/auth'
import { uploadAvatar } from '@/actions/storage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEditingName, setIsEditingName] = useState(false)
  const [displayName, setDisplayName] = useState(user.user_metadata?.display_name || 'unknown')
  const [tempDisplayName, setTempDisplayName] = useState(displayName)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.user_metadata?.avatar_url || null
  )

  const handleSaveDisplayName = () => {
    startTransition(async () => {
      try {
        await updateDisplayName(tempDisplayName)
        setDisplayName(tempDisplayName)
        setIsEditingName(false)
        router.refresh()
      } catch (error) {
        console.error('Display name update failed:', error)
        alert('表示名の更新に失敗しました')
      }
    })
  }

  const handleCancelEdit = () => {
    setTempDisplayName(displayName)
    setIsEditingName(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('avatar', file)
        
        const publicUrl = await uploadAvatar(formData)
        await updateAvatar(publicUrl)
        
        setAvatarUrl(publicUrl)
        router.refresh()
      } catch (error) {
        console.error('Avatar upload failed:', error)
        alert('画像のアップロードに失敗しました')
      }
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">アカウント設定</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィール画像</CardTitle>
            <CardDescription>
              アカウントのプロフィール画像を設定できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className={`absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full transition-colors ${
                  isPending 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer hover:bg-primary/80'
                }`}>
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Camera className="h-3 w-3" />
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isPending}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  JPEGまたはPNG形式、最大5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Name Section */}
        <Card>
          <CardHeader>
            <CardTitle>表示名</CardTitle>
            <CardDescription>
              アプリ内で表示される名前を設定できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingName ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="display-name">表示名</Label>
                  <Input
                    id="display-name"
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    placeholder="表示名を入力"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveDisplayName} size="sm" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      '保存'
                    )}
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" disabled={isPending}>
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{displayName}</p>
                </div>
                <Button
                  onClick={() => setIsEditingName(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  編集
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>アカウント情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                メールアドレス
              </Label>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                作成日時
              </Label>
              <p className="mt-1 text-sm">
                {new Date(user.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
