'use client'

import { useCallback, useState, useTransition } from 'react'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, Camera, Edit2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { updateDisplayName, updateAvatar } from '@/actions/users'
import { uploadAvatar } from '@/actions/storage'
import { getInitials } from '@/lib/utils/user'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { handleError, showSuccess } from '@/lib/utils/error-handler'
import Cropper, { type Area, type MediaSize } from 'react-easy-crop'
import { getCroppedImage } from '@/lib/utils/get-cropped-img'

interface UserProfileProps {
  user: User
}

const ASPECT_RATIO = 1
const CROP_WIDTH = 240

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEditingName, setIsEditingName] = useState(false)
  const [displayName, setDisplayName] = useState(user.user_metadata?.display_name || 'unknown')
  const [tempDisplayName, setTempDisplayName] = useState(displayName)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.user_metadata?.avatar_url || null
  )
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [minZoom, setMinZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const handleSaveDisplayName = () => {
    startTransition(async () => {
      try {
        await updateDisplayName(tempDisplayName)
        setDisplayName(tempDisplayName)
        setIsEditingName(false)
        showSuccess('表示名を更新しました')
        router.refresh()
      } catch (error) {
        handleError(error, 'user-profile-update')
      }
    })
  }

  const handleCancelEdit = () => {
    setTempDisplayName(displayName)
    setIsEditingName(false)
  }

  const handleAvatarSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (event.target) {
      event.target.value = ''
    }
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        handleError(new Error('画像の読み込みに失敗しました'), 'avatar-prepare')
        return
      }

      setImgSrc(reader.result)
      setIsCropDialogOpen(true)
    })
    reader.addEventListener('error', () => {
      handleError(new Error('画像の読み込みに失敗しました'), 'avatar-prepare')
    })
    reader.readAsDataURL(file)

    setSelectedFileName(file.name)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setMinZoom(1)
    setCroppedAreaPixels(null)
  }, [])

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const onMediaLoaded = useCallback(
    (mediaSize: MediaSize) => {
      const { width, height } = mediaSize
      const mediaAspectRatio = width / height

      if (mediaAspectRatio > ASPECT_RATIO) {
        const result = CROP_WIDTH / ASPECT_RATIO / height
        const zoomValue = Math.max(result, 1)
        setZoom(zoomValue)
        setMinZoom(zoomValue)
        return
      }

      const result = CROP_WIDTH / width
      const zoomValue = Math.max(result, 1)
      setZoom(zoomValue)
      setMinZoom(zoomValue)
    },
    []
  )

  const resetCropState = () => {
    setIsCropDialogOpen(false)
    setImgSrc(null)
    setSelectedFileName(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setMinZoom(1)
    setCroppedAreaPixels(null)
  }

  const handleCropConfirm = () => {
    if (!imgSrc || !croppedAreaPixels) {
      return
    }

    startTransition(async () => {
      const previousAvatar = avatarUrl
      let previewUrl: string | null = null

      try {
        const { blob, previewUrl: generatedPreviewUrl } = await getCroppedImage(
          imgSrc,
          croppedAreaPixels
        )
        previewUrl = generatedPreviewUrl
        setAvatarUrl(previewUrl)

        const fileName = selectedFileName?.replace(/\.[^/.]+$/, '') || 'avatar'
        const croppedFile = new File([blob], `${fileName}.jpeg`, {
          type: blob.type,
        })

        const formData = new FormData()
        formData.append('avatar', croppedFile)

        const publicUrl = await uploadAvatar(formData)
        await updateAvatar(publicUrl)
        setAvatarUrl(publicUrl)
        router.refresh()
        showSuccess('アバター画像を更新しました')
        resetCropState()
      } catch (error) {
        setAvatarUrl(previousAvatar)
        handleError(error, 'avatar-upload')
      } finally {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    })
  }

  const handleCropCancel = () => {
    if (isPending) return
    resetCropState()
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
                    onChange={handleAvatarSelect}
                    className="hidden"
                    disabled={isPending}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  JPEGまたはPNG形式、最大1MB
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
                  minute: '2-digit',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isCropDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCropCancel()
          }
        }}
      >
        <DialogContent showCloseButton={!isPending}>
          <DialogHeader>
            <DialogTitle>画像を調整</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
              {imgSrc && (
                <Cropper
                  image={imgSrc}
                  crop={crop}
                  zoom={zoom}
                  minZoom={minZoom}
                  maxZoom={minZoom + 3}
                  aspect={ASPECT_RATIO}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  cropSize={{
                    width: CROP_WIDTH,
                    height: CROP_WIDTH / ASPECT_RATIO,
                  }}
                  classes={{
                    containerClassName: 'avatar-crop-container',
                    cropAreaClassName: 'avatar-crop-area',
                    mediaClassName: 'avatar-crop-media',
                  }}
                  onMediaLoaded={onMediaLoaded}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar-zoom">ズーム</Label>
              <input
                id="avatar-zoom"
                type="range"
                min={minZoom}
                max={minZoom + 3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full"
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCropCancel} disabled={isPending}>
              キャンセル
            </Button>
            <Button onClick={handleCropConfirm} disabled={isPending || !croppedAreaPixels}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
