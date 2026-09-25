import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { getCatalog } from "../data/catalogs"
import { demoInvite } from "../data/demoInvite"
import { revokePhoto } from "../lib/photos"
import PhotoSlot from "../components/PhotoSlot"
import Tema3 from "../themes/tema-3/Tema3"
import "./Studio.css"

const DRAFT_KEY = (id) => `bersemi-draft-${id}`
const themes = { "tema-3": Tema3 }
const emptyPhotos = () => ({
  cover: null, names: null, ayat: null, pria: null, wanita: null,
  save: null, venue: null, close: null,
  gallery: [null, null, null, null, null, null],
})

const rupiah = (n) => `Rp${Number(n || 0).toLocaleString("id-ID")}`

const STEPS = [
  { id: "demo", label: "Demo", icon: "visibility" },
  { id: "isi", label: "Isi data", icon: "edit_note" },
  { id: "order", label: "Order", icon: "shopping_bag" },
]

const PHOTO_SLOTS = [
  { key: "wanita", title: "Mempelai wanita", ratio: "4 / 5" },
  { key: "pria", title: "Mempelai pria", ratio: "4 / 5" },
  { key: "ayat", title: "Sampul / ayat", ratio: "4 / 3" },
  { key: "close", title: "Penutup", ratio: "4 / 3" },
  { key: "venue", title: "Lokasi acara", ratio: "4 / 3" },
]

const HOWTO = [
  { t: "Lengkapi data", d: "Cek ejaan dan unggah foto yang tajam." },
  { t: "Tekan Order", d: "Setelah semua data sudah Anda yakini." },
  { t: "Verifikasi & bayar", d: "Kami hubungi lewat WhatsApp." },
  { t: "Link terkirim", d: "Undangan dikirim ke nomor yang sama." },
]

function mix(hex, light = "#f4efe6") {
  return { bg: hex, surface: light, ink: "#1a1a1a", accent: hex, mute: "#6e675c", line: "#e0d6c8", overlay: "rgba(0,0,0,.35)" }
}

export default function Studio() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const tema = useMemo(() => getCatalog(id), [id])
  const audioRef = useRef(null)

  const [step, setStep] = useState("demo")
  const [open, setOpen] = useState(true)
  const [pick, setPick] = useState(null)
  const [ink, setInk] = useState(0)
  const [customHex, setCustomHex] = useState("")
  const [song, setSong] = useState(0)
  const [customSong, setCustomSong] = useState(null)
  const [muted, setMuted] = useState(false)
  const [invite, setInvite] = useState(() => ({
    ...demoInvite,
    guest: params.get("to") || demoInvite.guest,
  }))
  const [photos, setPhotos] = useState(emptyPhotos)
  const [order, setOrder] = useState({ pemesan: "", wa: "", catatan: "" })
  const [alert, setAlert] = useState("")
  const [done, setDone] = useState("")
  const [rsvp, setRsvp] = useState({ hadir: null, nama: "", ucapan: "", note: "" })
  const [wishes, setWishes] = useState([])
  const [wishForm, setWishForm] = useState({ nama: "", teks: "", note: "" })

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    document.documentElement.dataset.theme = saved === "dark" ? "dark" : "light"
  }, [])

  useEffect(() => {
    if (!tema) return
    const raw = localStorage.getItem(DRAFT_KEY(tema.id))
    if (!raw) return
    try {
      const d = JSON.parse(raw)
      if (d.invite) setInvite((c) => ({ ...c, ...d.invite, guest: params.get("to") || d.invite.guest || c.guest }))
      if (typeof d.ink === "number") setInk(d.ink)
      if (d.customHex) setCustomHex(d.customHex)
      if (typeof d.song === "number") setSong(d.song)
    } catch { /* ignore */ }
  }, [tema, params])

  useEffect(() => {
    if (!tema) return
    localStorage.setItem(DRAFT_KEY(tema.id), JSON.stringify({ invite, ink, customHex, song }))
  }, [tema, invite, ink, customHex, song])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (step === "demo" && open && !muted) a.play().catch(() => {})
    else a.pause()
  }, [step, open, muted, song, customSong])

  const inks = tema?.inks || [
    { id: "a", name: "Gelap", hex: "#161412" },
    { id: "b", name: "Hati", hex: "#b33434" },
  ]
  const songs = tema?.songs || [
    { id: "piano", name: "Piano", file: "music/hitam-putih.mp3" },
    { id: "sinden", name: "Sinden", file: "music/tema-2.mp3" },
  ]
  const songIdx = songs[song] ? song : 0
  const primary = customHex || inks[ink]?.hex
  const pal = tema?.palettes?.[0]
  const fn = tema?.fonts?.[0]

  const themeStyle = useMemo(() => {
    const base = pal?.colors || mix(primary || "#0e1a2b")
    const tone = primary ? { ...base, bg: primary, accent: primary } : base
    return {
      "--bg": tone.bg,
      "--surface": tone.surface,
      "--ink": tone.ink,
      "--accent": tone.accent,
      "--mute": tone.mute,
      "--line": tone.line,
      "--overlay": tone.overlay,
      "--display": fn?.display || "Great Vibes",
      "--title": fn?.title || "Playfair Display",
      "--body": fn?.body || "Source Serif 4",
    }
  }, [pal, fn, primary])

  function setField(key, value) {
    setInvite((c) => ({ ...c, [key]: value }))
  }

  function handlePhoto(slot, file, index) {
    setPhotos((cur) => {
      if (slot === "gallery") {
        if (cur.gallery[index]) revokePhoto(cur.gallery[index])
        const gallery = [...cur.gallery]
        gallery[index] = file
        return { ...cur, gallery }
      }
      if (cur[slot]) revokePhoto(cur[slot])
      return { ...cur, [slot]: file }
    })
  }

  function handleRsvp(key, value) {
    if (key === "kirim") {
      setRsvp((c) => ({ ...c, note: c.nama.trim() ? "Ucapan tersimpan di pratinjau." : "Isi nama dulu." }))
      return
    }
    setRsvp((c) => ({ ...c, [key]: value, note: "" }))
  }

  function handleWish(key, value) {
    if (key === "kirim") {
      if (!wishForm.nama.trim() || !wishForm.teks.trim()) {
        setWishForm((c) => ({ ...c, note: "Isi nama dan ucapan." }))
        return
      }
      setWishes((list) => [{ nama: wishForm.nama.trim(), teks: wishForm.teks.trim() }, ...list])
      setWishForm({ nama: "", teks: "", note: "Tersimpan di pratinjau." })
      return
    }
    setWishForm((c) => ({ ...c, [key]: value, note: "" }))
  }

  function handleSongFile(file) {
    if (!file) return
    if (customSong?.url) URL.revokeObjectURL(customSong.url)
    setCustomSong({ url: URL.createObjectURL(file), name: file.name })
    setPick(null)
  }

  function go(next) {
    setPick(null)
    setAlert("")
    setStep(next)
  }

  function submitOrder() {
    const missing = []
    if (!invite.wanita.trim() || !invite.pria.trim()) missing.push("nama pasangan")
    if (!invite.tanggal) missing.push("tanggal")
    if (!order.pemesan.trim()) missing.push("nama pemesan")
    if (!order.wa.trim()) missing.push("WhatsApp")
    if (missing.length) {
      setAlert(`Lengkapi dulu: ${missing.join(", ")}.`)
      return
    }
    setDone("Pesanan tercatat. Kami akan menghubungi WhatsApp Anda untuk verifikasi dan pembayaran.")
  }

  const hariOtomatis = invite.tanggal
    ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(new Date(`${invite.tanggal}T00:00:00`))
    : ""

  const T = (key, label, extra = {}, note = "") => (
    <label className="row">
      <span>{label}{note && <em>{note}</em>}</span>
      <input value={invite[key] || ""} onChange={(e) => setField(key, e.target.value)} {...extra} />
    </label>
  )

  if (!tema) {
    return (
      <div className="studio missing">
        <p>Tema tidak ada.</p>
        <Link to="/">Kembali</Link>
      </div>
    )
  }

  const ThemeView = themes[tema.id] || Tema3
  const musicSrc = customSong?.url || `${import.meta.env.BASE_URL}${songs[songIdx].file}`
  const hargaAsli = tema.promoPrice && tema.promoPrice > tema.price ? tema.promoPrice : tema.price
  const diskon = hargaAsli - tema.price

  return (
    <div className={`studio step-${step}`}>
      <audio ref={audioRef} src={musicSrc} loop preload="none" />

      {step === "demo" && (
        <Link to="/" className="float-back" aria-label="Katalog">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
      )}

      {step === "demo" && (
        <div className="preview-wrap" style={themeStyle}>
          <ThemeView
            invite={invite}
            photos={photos}
            onPhoto={handlePhoto}
            onEdit={() => {}}
            open={open}
            onOpen={() => setOpen(true)}
            editing={false}
            rsvp={rsvp}
            onRsvp={handleRsvp}
            wishes={wishes}
            wishForm={wishForm}
            onWish={handleWish}
          />
        </div>
      )}

      {step === "isi" && (
        <div className="sheet-page">
          <form className="data-form" onSubmit={(e) => e.preventDefault()}>
            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">palette</span></i>Tampilan</header>
              <div className="row">
                <span>Warna</span>
                <div className="swrow">
                  {inks.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      className={!customHex && i === ink ? "swatch on" : "swatch"}
                      style={{ background: c.hex }}
                      aria-label={c.name}
                      onClick={() => { setInk(i); setCustomHex("") }}
                    />
                  ))}
                  <label className={customHex ? "swatch custom on" : "swatch custom"} title="Pilih sendiri">
                    <input type="color" value={customHex || primary || "#0e1a2b"} onChange={(e) => setCustomHex(e.target.value)} />
                  </label>
                </div>
              </div>
              <div className="row">
                <span>Musik</span>
                <div className="opt-row">
                  {songs.map((sg, i) => (
                    <button key={sg.id} type="button" className={!customSong && i === songIdx ? "opt on" : "opt"} onClick={() => { setSong(i); setCustomSong(null) }}>
                      <span className="material-symbols-outlined">music_note</span>{sg.name}
                    </button>
                  ))}
                  <label className={customSong ? "opt on" : "opt"}>
                    <span className="material-symbols-outlined">upload</span>{customSong ? customSong.name : "Unggah"}
                    <input type="file" accept="audio/*" hidden onChange={(e) => handleSongFile(e.target.files?.[0])} />
                  </label>
                </div>
              </div>
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">mail</span></i>Nama di undangan</header>
              {T("wanita", "Nama wanita")}
              {T("pria", "Nama pria")}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">female</span></i>Mempelai wanita</header>
              {T("wanitaLengkap", "Nama lengkap")}
              {T("ayahWanita", "Ayah")}
              {T("ibuWanita", "Ibu")}
              {T("igWanita", "Instagram")}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">male</span></i>Mempelai pria</header>
              {T("priaLengkap", "Nama lengkap")}
              {T("ayahPria", "Ayah")}
              {T("ibuPria", "Ibu")}
              {T("igPria", "Instagram")}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">event</span></i>Tanggal acara</header>
              {T("tanggal", "Tanggal", { type: "date" }, hariOtomatis)}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">favorite</span></i>Akad nikah</header>
              {T("waktuAkad", "Pukul")}
              {T("tempatAkad", "Tempat")}
              {T("alamatAkad", "Alamat")}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">celebration</span></i>Resepsi</header>
              {T("waktuResepsi", "Pukul")}
              {T("tempatResepsi", "Tempat")}
              {T("alamatResepsi", "Alamat")}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">redeem</span></i>Amplop</header>
              {T("bankNama", "Bank")}
              {T("bankRek", "Nomor rekening", { inputMode: "numeric" })}
              {T("bankAn", "Atas nama")}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">more_horiz</span></i>Lainnya</header>
              {T("alamatKado", "Alamat kirim kado")}
            </section>

            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">photo_library</span></i>Foto</header>
              <div className="ph-grid">
                {PHOTO_SLOTS.map((ph) => (
                  <div className="ph" key={ph.key}>
                    <p className="ph-t">{ph.title}</p>
                    <PhotoSlot label={ph.title} photo={photos[ph.key]} onChange={(f) => handlePhoto(ph.key, f)} ratio={ph.ratio} />
                  </div>
                ))}
              </div>
              <p className="ph-sub">Galeri</p>
              <div className="gal-row">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <PhotoSlot key={i} compact label={`Foto ${i + 1}`} photo={photos.gallery[i]} onChange={(f) => handlePhoto("gallery", f, i)} ratio="1 / 1" />
                ))}
              </div>
            </section>
          </form>
        </div>
      )}

      {step === "order" && (
        <div className="sheet-page">
          <form className="data-form" onSubmit={(e) => e.preventDefault()}>
            <section className="sec">
              <header className="sec-h"><i><span className="material-symbols-outlined">person</span></i>Pemesan</header>
              <label className="row">
                <span>Nama pemesan</span>
                <input value={order.pemesan} onChange={(e) => setOrder((o) => ({ ...o, pemesan: e.target.value }))} />
              </label>
              <label className="row">
                <span>Nomor WhatsApp</span>
                <input value={order.wa} onChange={(e) => setOrder((o) => ({ ...o, wa: e.target.value }))} inputMode="tel" />
              </label>
              <label className="row">
                <span>Catatan (opsional)</span>
                <textarea value={order.catatan} onChange={(e) => setOrder((o) => ({ ...o, catatan: e.target.value }))} rows={2} />
              </label>
            </section>

            <section className="card-how">
              <h3><span className="material-symbols-outlined">format_list_numbered</span>Cara pesan</h3>
              <ol>
                {HOWTO.map((h, i) => (
                  <li key={h.t}>
                    <span className="num">{i + 1}</span>
                    <span className="how-tx"><b>{h.t}</b><small>{h.d}</small></span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="card-warranty">
              <span className="warranty-ic"><span className="material-symbols-outlined">verified_user</span></span>
              <div>
                <h3>Garansi revisi 24 jam</h3>
                <p>Teks dan foto boleh direvisi tanpa biaya selama 24 jam setelah link terkirim.</p>
              </div>
            </section>

            <section className="card-sum">
              <h3>Ringkasan pesanan</h3>
              <div className="sum-row"><span>Tema</span><b>{tema.name}</b></div>
              <div className="sum-row"><span>Harga</span><b>{rupiah(hargaAsli)}</b></div>
              {diskon > 0 && <div className="sum-row disc"><span>Diskon</span><b>-{rupiah(diskon)}</b></div>}
              <div className="sum-row total"><span>Total</span><b>{rupiah(tema.price)}</b></div>
            </section>

            <button type="button" className="order-send" onClick={submitOrder}>Order</button>
            {done && <p className="ok">{done}</p>}
          </form>
        </div>
      )}

      <nav className="dock" aria-label="Langkah">
        {STEPS.map((st) => {
          const active = st.id === step
          return (
            <button key={st.id} type="button" className={active ? "dock-tab on" : "dock-tab"} aria-current={active ? "step" : undefined} onClick={() => go(st.id)}>
              <span className="material-symbols-outlined">{st.icon}</span>
              <span className="dock-label">{st.label}</span>
            </button>
          )
        })}
      </nav>

      {step === "demo" && (
        <div className="dock-color-item">
          {pick === "warna" && (
            <div className="dock-pop" role="menu">
              {inks.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className={!customHex && i === ink ? "swatch on" : "swatch"}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                  onClick={() => { setInk(i); setCustomHex(""); setPick(null) }}
                />
              ))}
              <label className="swatch custom" title="Pilih sendiri">
                <input
                  type="color"
                  value={customHex || primary || "#0e1a2b"}
                  onChange={(e) => setCustomHex(e.target.value)}
                />
              </label>
            </div>
          )}
          <button type="button" className="dock-color" aria-label="Warna" onClick={() => setPick(pick === "warna" ? null : "warna")}>
            <span className="material-symbols-outlined">palette</span>
          </button>
        </div>
      )}

      {alert && (
        <div className="alert-wrap">
          <button className="pop-dim" type="button" onClick={() => setAlert("")} />
          <div className="alert">
            <p>{alert}</p>
            <button type="button" onClick={() => { setAlert(""); go("isi") }}>Lengkapi data</button>
          </div>
        </div>
      )}
    </div>
  )
}
