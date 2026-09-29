export function compressPhoto(file, max = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Bukan berkas gambar."))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const width = Math.max(1, Math.round(img.width * scale))
      const height = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (!blob) {
            reject(new Error("Gagal memampatkan foto."))
            return
          }
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            name: file.name,
          })
        },
        "image/jpeg",
        quality,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Gambar tidak bisa dibaca."))
    }
    img.src = url
  })
}

export function revokePhoto(photo) {
  if (photo?.url?.startsWith("blob:")) URL.revokeObjectURL(photo.url)
}
