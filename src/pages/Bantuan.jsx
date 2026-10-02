import { useEffect, useState } from "react"
import { applyTheme, getTheme } from "../lib/theme"
import "./Bantuan.css"

const FAQ = [
  { q: "Perlu bikin akun dulu?", a: "Tidak. Pilih tema, isi data, tekan Order. Tidak ada login." },
  { q: "Kapan bayar dan dapat link?", a: "Setelah Order, admin menghubungi WhatsApp untuk tagihan. Setelah bayar, link dikirim ke nomor yang sama." },
  { q: "Boleh revisi setelah link terkirim?", a: "Boleh. Teks dan foto direvisi lewat admin selama 24 jam sejak link terkirim, tanpa biaya." },
  { q: "Berapa lama undangan aktif?", a: "Satu tahun sejak link terbit. Bisa diperpanjang." },
  { q: "Data tersimpan di mana?", a: "Di perangkat ini saja, bukan akun. Buka lagi dari HP yang sama." },
]

export default function Bantuan() {
  const [open, setOpen] = useState(null)
  const [theme, setTheme] = useState(getTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="bantuan">
      <div className="page-bar">
        <h1 className="bantuan-title">Bantuan</h1>
      </div>

      <div className="page-body">
        <div className="faq">
          {FAQ.map((f, i) => {
            const active = open === i
            return (
              <div className={active ? "faq-item on" : "faq-item"} key={f.q}>
                <button type="button" className="faq-q" onClick={() => setOpen(active ? null : i)}>
                  <span>{f.q}</span>
                  <span className="material-symbols-outlined">{active ? "remove" : "add"}</span>
                </button>
                <div className="faq-a"><p>{f.a}</p></div>
              </div>
            )
          })}
        </div>

        <div className="toggle-row sec-tampilan">
          <span>{theme === "dark" ? "Tampilan gelap" : "Tampilan terang"}</span>
          <button
            type="button"
            className={theme === "dark" ? "tog on" : "tog"}
            aria-label="Ganti tampilan"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
        </div>

        <p className="tentang">Pilih tema, modifikasi, selesai.</p>
      </div>
    </div>
  )
}
