export const demoInvite = {
  guest: "Tamu Undangan",
  pria: "Raka",
  wanita: "Alya",
  priaLengkap: "Raka Aditya Pratama",
  wanitaLengkap: "Alya Putri Rahmawati",
  ayahPria: "Bapak H. Surya Pratama",
  ibuPria: "Ibu Sinta Dewi",
  ayahWanita: "Bapak Ir. Budi Rahmawan",
  ibuWanita: "Ibu Nur Aini",
  tanggal: "2026-12-12",
  waktuAkad: "10.00 WIB",
  tempatAkad: "Masjid Al-Hikmah",
  alamatAkad: "Jl. Cendana No. 12, Bandung",
  waktuResepsi: "12.00 WIB",
  tempatResepsi: "The Sage Hall",
  alamatResepsi: "Jl. Ir. H. Djuanda No. 88, Bandung",
  ayatType: "islami",
  ayatRef: "QS. Ar-Rum: 21",
  ayat:
    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
  bankNama: "BCA",
  bankRek: "1234567890",
  bankAn: "Alya Putri Rahmawati",
  igPria: "raka.aditya",
  igWanita: "alya.rahma",
  alamatKado: "Jl. Cendana No. 12, Bandung",
  features: {
    ayat: true,
    gallery: true,
    envelope: true,
    rsvp: true,
  },
}

export const ayatOptions = {
  islami: {
    ref: "QS. Ar-Rum: 21",
    text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
  },
  kristiani: {
    ref: "Efesus 5:31",
    text: "Sebab itu laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya, sehingga keduanya itu menjadi satu daging.",
  },
  umum: {
    ref: "Untuk yang terkasih",
    text: "Dua jiwa, satu janji. Semoga hari ini menjadi awal kisah yang tenang, setia, dan penuh kasih.",
  },
}

export function formatTanggalPanjang(iso) {
  if (!iso) return ""
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  const weekday = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date)
  const body = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
  return `${weekday}, ${body}`
}
