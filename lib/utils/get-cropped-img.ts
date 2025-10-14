import type { Area } from 'react-easy-crop'

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export const getCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<{ blob: Blob; previewUrl: string }> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Failed to get 2D context for cropping')
  }

  canvas.width = image.width
  canvas.height = image.height
  context.drawImage(image, 0, 0)

  const data = context.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  context.putImageData(data, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve({
          blob: file,
          previewUrl: URL.createObjectURL(file),
        })
      } else {
        reject(new Error('Failed to generate cropped image'))
      }
    }, 'image/jpeg')
  })
}
