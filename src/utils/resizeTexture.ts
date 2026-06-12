import * as THREE from 'three'

export function resizeTexture(texture: THREE.Texture, maxSize: number): void {
  const img = texture.image as HTMLImageElement | HTMLCanvasElement
  if (!img || (img.width <= maxSize && img.height <= maxSize)) return

  const scale = Math.min(maxSize / img.width, maxSize / img.height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(img.width * scale)
  canvas.height = Math.floor(img.height * scale)

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img as CanvasImageSource, 0, 0, canvas.width, canvas.height)

  texture.image = canvas
  texture.needsUpdate = true
}
