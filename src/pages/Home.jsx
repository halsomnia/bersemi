import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import CoverThumb from "../components/CoverThumb"
import Logo from "../components/Logo"
import { catalogs } from "../data/catalogs"
import "./Home.css"

const categories = ["Nikah", "Lamaran", "Ultah"]
const WA = "https://wa.me/6285163501302"

function formatPrice(n) {
  return `${Math.round(n / 1000)}rb`
}

export default function Home() {
  const navigate = useNavigate()
  const [q, setQ] = useState("")
  const [chip, setChip] = useState("Semua")
  const [promoOnly, setPromoOnly] = useState(false)
  const [menu, setMenu] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light"
    localStorage.setItem("theme", theme)
  }, [theme])

  const counts = useMemo(() => {
    const out = { promo: 0 }
    catalogs.filter((c) => c.active).forEach((c) => {
      out[c.category] = (out[c.category] || 0) + 1
      if (c.promo) out.promo += 1
    })
    return out
  }, [])

  const items = useMemo(() => {
    const key = q.trim().toLowerCase()
    const chipKey = chip.toLowerCase()
    return catalogs.filter((c) => {
      if (!c.active) return false
      if (promoOnly && !c.promo) return false
      const hay = `${c.name} ${c.desc} ${c.category} ${c.style}`.toLowerCase()
      if (key && !hay.includes(key)) return false
      if (chipKey !== "semua" && c.category !== chipKey) return false
      return true
    })
  }, [q, chip, promoOnly])

  function pickCategory(name) {
    if (name === "Promo") {
      setPromoOnly(true)
      setChip("Semua")
    } else {
      setChip(name)
    }
    setMenu(false)
  }

  return (
    <div className="home">
      <header className="home-head">
        <Logo />
        <button className="burger" type="button" onClick={() => setMenu(true)} aria-label="Menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>
      <p className="tag">Pilih tema, modifikasi, selesai.</p>
      <label className="search-wrap">
        <span className="material-symbols-outlined search-ico">search</span>
        <input className="search" placeholder="Cari tema" value={q} onChange={(e) => setQ(e.target.value)} />
        {q && (
          <button className="search-clear" type="button" onClick={() => setQ("")} aria-label="Hapus pencarian">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </label>
      <div className="filters">
        <div className="chips" role="tablist" aria-label="Kategori">
          <button type="button" className={promoOnly ? "chip promo on" : "chip promo"} onClick={() => setPromoOnly((v) => !v)}>Promo</button>
          {["Semua", ...categories].map((c) => (
            <button key={c} className={chip === c ? "chip on" : "chip"} onClick={() => setChip(c)} type="button">{c}</button>
          ))}
        </div>
      </div>
      <div className="grid">
        {items.map((c) => (
          <article key={c.id} className="card" onClick={() => navigate(`/studio/${c.id}`)}>
            <CoverThumb name={c.name} couple="Alya & Raka" variant={c.thumb} />
            {c.promo && <span className="badge">Promo</span>}
            <div className="meta">
              <div className="row1">
                <span className="name">{c.name}</span>
                <span className="cat">{c.category}</span>
              </div>
              <div className="price">
                {c.promoPrice ? <span className="old">{formatPrice(c.promoPrice)}</span> : null}
                <span className="now">{formatPrice(c.price)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && (
        <div className="empty">
          <p>Tidak ada tema untuk filter ini.</p>
          <button type="button" className="ghost" onClick={() => { setChip("Semua"); setPromoOnly(false); setQ("") }}>Tampilkan semua</button>
        </div>
      )}
      {menu && (
        <div className="nav">
          <button className="nav-dim" type="button" onClick={() => setMenu(false)} aria-label="Tutup menu" />
          <aside className="drawer">
            <Logo />
            <p className="h">Kategori</p>
            <button className={promoOnly ? "nav-item on" : "nav-item"} type="button" onClick={() => pickCategory("Promo")}>Promo<span>{counts.promo || 0}</span></button>
            {categories.map((name) => (
              <button key={name} className={chip === name ? "nav-item on" : "nav-item"} type="button" onClick={() => pickCategory(name)}>
                {name}<span>{counts[name.toLowerCase()] || 0}</span>
              </button>
            ))}
            <p className="h">Bantuan</p>
            <a className="wa" href={WA} target="_blank" rel="noreferrer">Chat Admin</a>
            <p className="h">Tentang</p>
            <p className="about">Pilih tema, modifikasi, selesai.</p>
            <div className="nav-foot">
              <span>{theme === "dark" ? "Tampilan gelap" : "Tampilan terang"}</span>
              <button className={theme === "dark" ? "tog on" : "tog"} type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Ganti tampilan" />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}