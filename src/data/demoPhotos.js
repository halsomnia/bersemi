// Foto contoh per tema. Taruh file di public/demo/<id-tema>/ (lihat daftar nama di bawah).
// Tampil otomatis di Pratinjau; pelanggan tetap bisa ganti/hapus lewat slot Foto di Isi data.
const base = () => `${import.meta.env.BASE_URL}demo`
const foto = (tema, nama) => ({ url: `${base()}/${tema}/${nama}`, name: nama, demo: true })

const minimal = () => ({
  cover: foto("minimal", "cover.jpg"),
  hero: foto("minimal", "hero.jpg"),
  wanita: foto("minimal", "wanita.jpg"),
  pria: foto("minimal", "pria.jpg"),
  events: foto("minimal", "events.jpg"),
  love: foto("minimal", "love.jpg"),
  rsvp: foto("minimal", "rsvp.jpg"),
  close: foto("minimal", "close.jpg"),
  gallery: [1, 2, 3, 4, 5, 6].map((n) => foto("minimal", `galeri-${n}.jpg`)),
})

const packs = { minimal }

export function demoPhotos(temaId) {
  return packs[temaId]?.() || null
}
