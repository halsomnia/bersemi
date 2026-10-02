import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { getCatalog } from "../data/catalogs"
import { demoInvite } from "../data/demoInvite"
import { revokePhoto } from "../lib/photos"
import PhotoSlot from "../components/PhotoSlot"
import InviteFrame from "../components/InviteFrame"
import Logo from "../components/Logo"
import { applyTheme, getTheme } from "../lib/theme"
import Minimal from "../themes/minimal/Minimal"
import "./Studio.css"

const DRAFT_KEY = (id) => `bersemi-draft-${id}`
const themes = { minimal: Minimal }
const emptyPhotos = () => ({
  cover: null, hero: null, names: null, ayat: null, pria: null, wanita: null,
  save: null, venue: null, events: null, love: null, rsvp: null, close: null,
  gallery: [null, null, null, null, null, null],
})

const rupiah = (n) => `Rp${Number(n || 0).toLocaleString("id-ID")}`

const STEPS = [
  { id: "demo", label: "Pratinjau", icon: "visibility" },
  { id: "isi", label: "Isi data", icon: "edit_note" },
  { id: "order", label: "Order", icon: "shopping_bag" },
]

const DEVICES = [
  { id: "desk", label: "Laptop", icon: "laptop_mac" },
  { id: "tab", label: "Tablet", icon: "tablet_mac" },
  { id: "hp", label: "HP", icon: "smartphone" },
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
  { t: "Tekan Order", d: "Pesanan tersimpan, tanpa perlu bikin akun." },
  { t: "Tagihan dari admin", d: "Admin cek pesanan, lalu kirim tagihan ke WhatsApp Anda." },
  { t: "Link terkirim", d: "Setelah bayar, link undangan dikirim ke WhatsApp yang sama." },
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
  const [device, setDevice] = useState("desk")
  const [mode, setMode] = useState(getTheme)
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
  const [chromeVisible, setChromeVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    if (step !== "demo") {
      setChromeVisible(true)
      return
    }
    setChromeVisible(true)
    lastY.current = window.scrollY
    function onScroll() {
      const y = window.scrollY
      const diff = y - lastY.current
      if (y < 40) setChromeVisible(true)
      else if (diff > 6) setChromeVisible(false)
      else if (diff < -6) setChromeVisible(true)
      lastY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [step])

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
      "--th-bg": tone.bg,
      "--th-surface": tone.surface,
      "--th-ink": tone.ink,
      "--th-accent": tone.accent,
      "--th-mute": tone.mute,
      "--th-line": tone.line,
      "--th-overlay": tone.overlay,
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
      if (!rsvp.nama.trim()) {
        setRsvp((c) => ({ ...c, note: "Isi nama dulu." }))
        return
      }
      if (rsvp.ucapan.trim()) {
        setWishes((list) => [{ nama: rsvp.nama.trim(), teks: rsvp.ucapan.trim() }, ...list])
      }
      setRsvp((c) => ({ ...c, note: "Tersimpan di pratinjau.", ucapan: "" }))
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

  function toggleMode() {
    const next = mode === "dark" ? "light" : "dark"
    applyTheme(next)
    setMode(next)
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
    const entry = {
      id: `${tema.id}-${Date.now()}`,
      temaId: tema.id,
      temaNama: tema.name,
      pasangan: `${invite.wanita} & ${invite.pria}`,
      tanggal: invite.tanggal,
      pemesan: order.pemesan,
      wa: order.wa,
      catatan: order.catatan,
      harga: tema.price,
      status: "menunggu",
      dibuat: new Date().toISOString(),
    }
    try {
      const raw = localStorage.getItem("bersemi-orders")
      const list = raw ? JSON.parse(raw) : []
      list.unshift(entry)
      localStorage.setItem("bersemi-orders", JSON.stringify(list))
    } catch { /* ignore */ }
    setDone("Pesanan tersimpan. Admin akan kirim tagihan ke WhatsApp Anda.")
  }

  const hariOtomatis = invite.tanggal
    ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(new Date(`${invite.tanggal}T00:00:00`))
    : ""

  const T = (key, label, extra = {}, note = "") => (
    <label className="f-row">
      <span className="f-label">{label}{note && <em>{note}</em>}</span>
      <input className="f-input" value={invite[key] || ""} onChange={(e) => setField(key, e.target.value)} {...extra} />
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

  const ThemeView = themes[tema.id] || Minimal
  const themeNode = (
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
  )
  const preview = device === "desk"
    ? <InviteFrame invite={invite} photos={photos}>{themeNode}</InviteFrame>
    : <div className="phone-preview">{themeNode}</div>
  const form = tema.form || { extras: [], galleryCount: 6 }
  const extra = form.extras || []
  const photoSlots = form.photos || PHOTO_SLOTS
  const galN = form.galleryCount || 6
  const musicSrc = customSong?.url || `${import.meta.env.BASE_URL}${songs[songIdx].file}`
  const hargaAsli = tema.promoPrice && tema.promoPrice > tema.price ? tema.promoPrice : tema.price
  const diskon = hargaAsli - tema.price

  return (
    <div className={`studio step-${step} device-${device}`}>
      <audio ref={audioRef} src={musicSrc} loop preload="none" />

      {step === "demo" && (
        <div className="preview-wrap" style={themeStyle}>
          {preview}
        </div>
      )}

      {step === "isi" && (
        <div className="sheet-page">
          <div className="desk-preview" style={themeStyle}>{preview}</div>
          <form className="data-form studio-form" onSubmit={(e) => e.preventDefault()}>
            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">palette</span></i>Tampilan</header>
              <div className="f-row">
                <span className="f-label">Warna</span>
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
              <div className="f-row">
                <span className="f-label">Musik</span>
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

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">mail</span></i>Nama di undangan</header>
              {T("wanita", "Nama wanita")}
              {T("pria", "Nama pria")}
            </section>

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">female</span></i>Mempelai wanita</header>
              {T("wanitaLengkap", "Nama lengkap")}
              {T("ayahWanita", "Ayah")}
              {T("ibuWanita", "Ibu")}
              {T("igWanita", "Instagram")}
            </section>

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">male</span></i>Mempelai pria</header>
              {T("priaLengkap", "Nama lengkap")}
              {T("ayahPria", "Ayah")}
              {T("ibuPria", "Ibu")}
              {T("igPria", "Instagram")}
            </section>

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">event</span></i>Tanggal acara</header>
              {T("tanggal", "Tanggal", { type: "date" }, hariOtomatis)}
            </section>

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">favorite</span></i>Akad nikah</header>
              {T("waktuAkad", "Pukul")}
              {T("tempatAkad", "Tempat")}
              {T("alamatAkad", "Alamat")}
            </section>

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">celebration</span></i>Resepsi</header>
              {T("waktuResepsi", "Pukul")}
              {T("tempatResepsi", "Tempat")}
              {T("alamatResepsi", "Alamat")}
            </section>

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">redeem</span></i>Amplop</header>
              {T("bankNama", "Bank")}
              {T("bankRek", "Nomor rekening", { inputMode: "numeric" })}
              {T("bankAn", "Atas nama")}
            </section>

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">more_horiz</span></i>Lainnya</header>
              {T("alamatKado", "Alamat kirim kado")}
              {extra.includes("giftRumah") && T("giftRumah", "Nama rumah / penerima kado")}
            </section>

            {extra.includes("urutan") && (
              <section className="f-card">
                <header className="f-head"><i><span className="material-symbols-outlined">family_restroom</span></i>Urutan anak</header>
                {T("urutanWanita", "Wanita, mis. Putri pertama dari")}
                {T("urutanPria", "Pria, mis. Putra kedua dari")}
              </section>
            )}

            {extra.includes("streaming") && (
              <section className="f-card">
                <header className="f-head">
                  <i><span className="material-symbols-outlined">videocam</span></i>Live streaming
                  <button type="button" className={invite.liveOn !== false ? "opt on" : "opt"} onClick={() => setField("liveOn", invite.liveOn === false)}>
                    {invite.liveOn === false ? "Nonaktif" : "Aktif"}
                  </button>
                </header>
                {invite.liveOn !== false && (
                  <>
                    {T("liveWaktu", "Jam siaran")}
                    {T("liveLink", "Tautan", { type: "url", placeholder: "https://" })}
                  </>
                )}
              </section>
            )}

            {extra.includes("loveStory") && (
              <section className="f-card">
                <header className="f-head">
                  <i><span className="material-symbols-outlined">auto_stories</span></i>Love story
                  <button type="button" className={invite.loveOn !== false ? "opt on" : "opt"} onClick={() => setField("loveOn", invite.loveOn === false)}>
                    {invite.loveOn === false ? "Nonaktif" : "Aktif"}
                  </button>
                </header>
                {invite.loveOn !== false && (
                  <>
                    {(invite.loveStory || []).map((row, i) => (
                      <div className="f-story" key={i}>
                        <input value={row.judul} onChange={(e) => {
                          const next = [...invite.loveStory]
                          next[i] = { ...next[i], judul: e.target.value }
                          setField("loveStory", next)
                        }} placeholder="Judul" />
                        <input value={row.tahun} onChange={(e) => {
                          const next = [...invite.loveStory]
                          next[i] = { ...next[i], tahun: e.target.value }
                          setField("loveStory", next)
                        }} placeholder="Tahun" />
                        <textarea value={row.teks} onChange={(e) => {
                          const next = [...invite.loveStory]
                          next[i] = { ...next[i], teks: e.target.value }
                          setField("loveStory", next)
                        }} placeholder="Cerita" rows={2} />
                        {(invite.loveStory || []).length > 2 && (
                          <button type="button" className="opt" onClick={() => setField("loveStory", invite.loveStory.filter((_, x) => x !== i))}>Hapus</button>
                        )}
                      </div>
                    ))}
                    {(invite.loveStory || []).length < 4 && (
                      <button type="button" className="opt" onClick={() => setField("loveStory", [...(invite.loveStory || []), { tahun: "", judul: "", teks: "" }])}>
                        Tambah cerita
                      </button>
                    )}
                  </>
                )}
              </section>
            )}

            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">photo_library</span></i>Foto</header>
              <div className="ph-grid">
                {photoSlots.map((ph) => (
                  <div className="ph" key={ph.key}>
                    <p className="ph-t">{ph.title}</p>
                    <PhotoSlot label={ph.title} photo={photos[ph.key]} onChange={(f) => handlePhoto(ph.key, f)} ratio={ph.ratio} />
                  </div>
                ))}
              </div>
              <p className="ph-sub">Galeri · {galN} foto</p>
              <div className="gal-row">
                {Array.from({ length: galN }, (_, i) => i).map((i) => (
                  <PhotoSlot key={i} compact label={`Foto ${i + 1}`} photo={photos.gallery[i]} onChange={(f) => handlePhoto("gallery", f, i)} ratio="1 / 1" />
                ))}
              </div>
            </section>
          </form>
        </div>
      )}

      {step === "order" && (
        <div className="sheet-page">
          <div className="desk-preview" style={themeStyle}>{preview}</div>
          <form className="data-form studio-form" onSubmit={(e) => e.preventDefault()}>
            <section className="f-card">
              <header className="f-head"><i><span className="material-symbols-outlined">person</span></i>Pemesan</header>
              <label className="f-row">
                <span className="f-label">Nama pemesan</span>
                <input className="f-input" value={order.pemesan} onChange={(e) => setOrder((o) => ({ ...o, pemesan: e.target.value }))} />
              </label>
              <label className="f-row">
                <span className="f-label">Nomor WhatsApp</span>
                <input className="f-input" value={order.wa} onChange={(e) => setOrder((o) => ({ ...o, wa: e.target.value }))} inputMode="tel" />
              </label>
              <label className="f-row">
                <span className="f-label">Catatan (opsional)</span>
                <textarea className="f-input" value={order.catatan} onChange={(e) => setOrder((o) => ({ ...o, catatan: e.target.value }))} rows={2} />
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
            {done && (
              <p className="ok">
                {done} <Link to="/pesanan">Buka Pesanan Saya</Link>
              </p>
            )}
          </form>
        </div>
      )}

      <nav className={chromeVisible ? "dock" : "dock hide"} aria-label="Langkah">
        <div className="dock-top"><Logo /></div>
        {STEPS.map((st) => {
          const active = st.id === step
          return (
            <Fragment key={st.id}>
              <button type="button" className={active ? "dock-tab on" : "dock-tab"} aria-current={active ? "step" : undefined} onClick={() => go(st.id)}>
                <span className="material-symbols-outlined">{st.icon}</span>
                <span className="dock-label">{st.label}</span>
              </button>
              {st.id === "demo" && active && (
                <div className="dock-sub" role="group" aria-label="Tampilan perangkat">
                  {DEVICES.map((d) => (
                    <button key={d.id} type="button" className={device === d.id ? "dock-sub-tab on" : "dock-sub-tab"} aria-pressed={device === d.id} onClick={() => setDevice(d.id)}>
                      <span className="material-symbols-outlined">{d.icon}</span>
                      <span>{d.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </Fragment>
          )
        })}
        <div className="dock-foot">
          <p className="dock-tag">Pilih tema, modifikasi, selesai.</p>
          <button type="button" className="dock-tab dock-mode" onClick={toggleMode}>
            <span className="material-symbols-outlined">{mode === "dark" ? "light_mode" : "dark_mode"}</span>
            <span className="dock-label">{mode === "dark" ? "Mode terang" : "Mode gelap"}</span>
          </button>
        </div>
      </nav>

      {step === "demo" && (
        <div className={chromeVisible ? "dock-color-item" : "dock-color-item hide"}>
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
