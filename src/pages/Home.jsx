import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import CoverThumb from "../components/CoverThumb"
import Logo from "../components/Logo"
import { catalogs } from "../data/catalogs"
import "./Home.css"

const categories = ["Nikah", "Lamaran", "Ultah"]

function formatPrice(n) {
  return `${Math.round(n / 1000)}rb`
}

export default function Home() {
  const navigate = useNavigate()
  const [q, setQ] = useState("")
  const [chip, setChip] = useState("Semua")
  const [promoOnly, setPromoOnly] = useState(false)

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

  return (
    <div className="home">
      <header className="home-head">
        <Logo />
      </header>
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
    </div>
  )
}
