import { useState, useRef, useEffect } from "react"
import Countdown from "../../components/Countdown"
import { formatTanggalPanjang, tanggalResepsiBerlaku } from "../../data/demoInvite"
import { googleCalendarUrl } from "../../lib/calendar"
import { readFileAsDataUrl } from "../../lib/photos"
import "./Minimal.css"

function mapsUrl(place, address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place || ""} ${address || ""}`)}`
}

function Bg({ photo, className, children }) {
  const style = photo?.url ? { backgroundImage: `url(${photo.url})` } : undefined
  return <section className={className} style={style}>{children}</section>
}

function dari(kata, urutan) {
  return [kata, (urutan || "").trim(), "dari"].filter(Boolean).join(" ").toUpperCase()
}

function RekeningItem({ label, bank, rek, nama }) {
  const [ok, setOk] = useState(false)
  if (!rek) return null

  async function salin() {
    try {
      await navigator.clipboard.writeText(String(rek).replace(/\s/g, ""))
      setOk(true)
      setTimeout(() => setOk(false), 1600)
    } catch { /* clipboard tidak tersedia */ }
  }

  return (
    <div className="mn-acc-card">
      <div className="mn-acc-top">
        <span className="mn-acc-bank-tag">{bank}</span>
        <span className="mn-acc-label-tag">{label}</span>
      </div>
      <div className="mn-acc-mid">
        <div>
          <div className="mn-acc-digits">{rek}</div>
          <div className="mn-acc-holder">a.n. {nama}</div>
        </div>
        <button
          type="button"
          className={`mn-acc-btn${ok ? " ok" : ""}`}
          onClick={salin}
          title="Salin nomor rekening"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
            {ok ? "check" : "content_copy"}
          </span>
          <span>{ok ? "Tersalin" : "Salin"}</span>
        </button>
      </div>
    </div>
  )
}

function AlamatKadoItem({ rumah, alamat }) {
  const [ok, setOk] = useState(false)
  if (!alamat) return null

  async function salin() {
    try {
      await navigator.clipboard.writeText(`${rumah ? `${rumah}\n` : ""}${alamat}`)
      setOk(true)
      setTimeout(() => setOk(false), 1600)
    } catch { /* clipboard tidak tersedia */ }
  }

  return (
    <div className="mn-kado-card">
      <div className="mn-kado-header">
        <span className="mn-kado-title">Kirim Kado Fisik</span>
        {rumah && <span className="mn-kado-target">{rumah}</span>}
      </div>
      <div className="mn-kado-body">
        <p>{alamat}</p>
      </div>
      <button
        type="button"
        className={`mn-acc-btn${ok ? " ok" : ""}`}
        onClick={salin}
        title="Salin alamat pengiriman"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
          {ok ? "check" : "content_copy"}
        </span>
        <span>{ok ? "Tersalin" : "Salin Alamat"}</span>
      </button>
    </div>
  )
}

function Divider() {
  return (
    <span className="mn-divider" aria-hidden="true">
      <i />
    </span>
  )
}

function IgLink({ username, label }) {
  if (!username) return null
  const handle = username.replace(/^@/, "").trim()
  if (!handle) return null
  return (
    <a
      className="mn-ig"
      href={`https://instagram.com/${handle}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Instagram ${label || handle}`}
    >
      <svg className="mn-ig-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
      <span>@{handle}</span>
    </a>
  )
}

function isAkadPassed(tgl) {
  if (!tgl) return true
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const akad = new Date(tgl + "T00:00:00")
    if (isNaN(akad.getTime())) return true
    return today >= akad
  } catch {
    return true
  }
}

function MomentDetailModal({ moment, onClose }) {
  if (!moment) return null
  const photo = moment.photo || (moment.photos && moment.photos[0])

  return (
    <div className="mn-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mn-detail-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="mn-detail-close" onClick={onClose} aria-label="Tutup">
          <span className="material-symbols-outlined">close</span>
        </button>
        {photo && (
          <div className="mn-detail-media">
            <img src={photo} alt={`Momen dari ${moment.nama}`} />
          </div>
        )}
        <div className="mn-detail-body">
          <div className="mn-detail-user">
            <div className="mn-detail-avatar" aria-hidden="true">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <b className="mn-detail-name">{moment.nama}</b>
              <span className="mn-detail-time">{moment.time || "Hari Akad"}</span>
            </div>
          </div>
          {moment.caption && (
            <p className="mn-detail-caption">“{moment.caption}”</p>
          )}
        </div>
      </div>
    </div>
  )
}

function GuestUploadModal({ isOpen, onClose, defaultName, onAddMoment, isEventStarted, tanggalAkad }) {
  const [photo, setPhoto] = useState(null)
  const [nama, setNama] = useState(defaultName || "")
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (defaultName) setNama(defaultName)
  }, [defaultName])

  if (!isOpen) return null

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setLoading(true)
    try {
      const dataUrl = await readFileAsDataUrl(file, 960, 0.75)
      setPhoto(dataUrl)
    } catch (err) {
      setError(err.message || "Gagal memproses gambar.")
    } finally {
      setLoading(false)
    }
  }

  function removePhoto(e) {
    e.stopPropagation()
    setPhoto(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const isReady = nama.trim().length > 0 && Boolean(photo) && !loading

  function handleSubmit(e) {
    e.preventDefault()
    if (!nama.trim()) {
      setError("Silakan masukkan nama Anda.")
      return
    }
    if (!photo) {
      setError("Silakan pilih foto momen Anda.")
      return
    }
    onAddMoment({
      id: "guest-" + Date.now(),
      nama: nama.trim(),
      photo,
      caption: caption.trim(),
      time: "Hari ini",
    })
    setPhoto(null)
    setCaption("")
    onClose()
  }

  return (
    <div className="mn-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mn-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mn-modal-head">
          <div className="mn-modal-title-wrap">
            <span className="material-symbols-outlined">photo_camera</span>
            <h3>Unggah Foto Tamu</h3>
          </div>
          <button type="button" className="mn-modal-close" onClick={onClose} aria-label="Tutup">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mn-modal-body">
          {!isEventStarted && (
            <div className="mn-modal-notice">
              <span className="material-symbols-outlined">schedule</span>
              <span>Unggah foto momen dibuka pada hari akad (${tanggalAkad}). Anda sedang dalam mode pratinjau.</span>
            </div>
          )}
          <div className="mn-modal-group">
            <label className="mn-modal-label">Foto Momen (1 Foto)</label>
            <div
              className={`mn-photo-slot single-slot${photo ? " filled" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFile}
              />
              {photo ? (
                <>
                  <img src={photo} alt="Foto yang dipilih" />
                  <button
                    type="button"
                    className="mn-slot-del"
                    onClick={removePhoto}
                    title="Ganti foto"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </>
              ) : (
                <div className="mn-slot-empty">
                  <span className="material-symbols-outlined">add_a_photo</span>
                  <span>Pilih atau Ambil Foto</span>
                </div>
              )}
            </div>
          </div>

          <div className="mn-modal-group">
            <label className="mn-modal-label" htmlFor="guest-name-field">Nama Tamu</label>
            <input
              id="guest-name-field"
              type="text"
              className="mn-modal-input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Anda"
              required
            />
          </div>

          <div className="mn-modal-group">
            <label className="mn-modal-label" htmlFor="guest-caption-field">Ucapan / Doa Singkat (Opsional)</label>
            <textarea
              id="guest-caption-field"
              className="mn-modal-input mn-modal-textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tuliskan ucapan atau kenangan singkat..."
              rows={2}
            />
          </div>

          {error && <p className="mn-modal-error">{error}</p>}

          <button
            type="submit"
            className="mn-btn full mn-modal-submit"
            disabled={!isReady}
          >
            {loading ? "Memproses Foto..." : "Kirim Foto"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Minimal({
  invite,
  photos,
  open,
  onOpen,
  rsvp,
  onRsvp,
  wishes = [],
}) {
  const [tab, setTab] = useState("undangan")
  const [giftTab, setGiftTab] = useState("bank")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedMoment, setSelectedMoment] = useState(null)

  const momentsKey = `bersemi_guest_moments_${invite.wanita || "minimal"}`
  const uploadKey = `bersemi_guest_uploaded_${invite.wanita || "minimal"}`

  const [hasUploaded, setHasUploaded] = useState(() => {
    try {
      return localStorage.getItem(uploadKey) === "true"
    } catch {
      return false
    }
  })

  const [guestMoments, setGuestMoments] = useState(() => {
    try {
      const saved = localStorage.getItem(momentsKey)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return [
      {
        id: "demo-guest-1",
        nama: "Rian dan Dita",
        photo: `${import.meta.env.BASE_URL}demo/minimal/galeri-2.jpg`,
        caption: "Selamat menempuh hidup baru Alya dan Raka! Bahagia dan berkah selalu.",
        time: "Hari Akad",
      },
      {
        id: "demo-guest-2",
        nama: "Bima dan Rekan",
        photo: `${import.meta.env.BASE_URL}demo/minimal/galeri-4.jpg`,
        caption: "Happy wedding bro Raka dan Alya! Langgeng sampai kakek nenek.",
        time: "Hari Akad",
      },
    ]
  })

  const isEventStarted = isAkadPassed(invite.tanggalAkad)

  function handleAddMoment(moment) {
    setGuestMoments((prev) => {
      const next = [moment, ...prev]
      try {
        localStorage.setItem(momentsKey, JSON.stringify(next))
      } catch { /* storage quota */ }
      return next
    })
    try {
      localStorage.setItem(uploadKey, "true")
    } catch { /* ignore */ }
    setHasUploaded(true)
  }

  function handleResetUpload() {
    try {
      localStorage.removeItem(uploadKey)
    } catch { /* ignore */ }
    setHasUploaded(false)
  }
  const tanggal = formatTanggalPanjang(invite.tanggalAkad)
  const tglResepsi = formatTanggalPanjang(tanggalResepsiBerlaku(invite))
  const sama = invite.resepsiSama !== false
  const g = photos.gallery || []
  const story = (invite.loveStory || []).slice(0, 4)
  const cal = googleCalendarUrl(invite)
  const hasBank = !!(invite.bankRekWanita || invite.bankRekPria)
  const hasKado = !!(invite.alamatKado)

  function sendRsvp() {
    onRsvp("kirim")
  }

  function switchTab(t) {
    setTab(t)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      const scroller = document.querySelector(".invite-scroll")
      if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <article className="mn">
      {!open ? (
        <Bg photo={photos.cover} className="mn-cover">
          <p className="mn-small">Undangan Pernikahan</p>
          <h1 className="mn-script">{invite.wanita} &amp; {invite.pria}</h1>
          <p className="mn-date">{tanggal}</p>
          <div className="mn-moon" aria-hidden="true" />
          <div className="mn-cover-foot">
            <p className="mn-to">Kepada Yth.</p>
            <p className="mn-guest">{invite.guest || "Tamu Undangan"}</p>
            <button type="button" className="mn-btn" onClick={onOpen}>Buka Undangan</button>
          </div>
        </Bg>
      ) : (
        <>
          {tab === "undangan" && (
            <div className="mn-tab-content">
              <Bg photo={photos.hero} className="mn-hero">
                <p className="mn-small">The Wedding of</p>
                <h2 className="mn-script lg">{invite.wanita} &amp; {invite.pria}</h2>
                <p className="mn-date">{tanggal}</p>
                <Divider />
                <p className="mn-place">
                  {sama ? invite.tempatResepsi : invite.tempatAkad}<br />{sama ? invite.alamatResepsi : invite.alamatAkad}
                </p>
              </Bg>

              <section className="mn-quote">
                <blockquote>“{invite.ayat}”</blockquote>
                <cite>{invite.ayatRef || "Q.S Ar-Rum: 21"}</cite>
              </section>

              <Bg photo={photos.wanita} className="mn-person">
                <p className="mn-small">The Bride</p>
                <h2 className="mn-script">{invite.wanitaLengkap || invite.wanita}</h2>
                <p className="mn-from">{dari("Putri", invite.urutanWanita)}</p>
                <Divider />
                <p className="mn-ortu">{invite.ayahWanita} &amp; {invite.ibuWanita}</p>
                <IgLink username={invite.igWanita} label={invite.wanita} />
              </Bg>

              <Bg photo={photos.pria} className="mn-person">
                <p className="mn-small">The Groom</p>
                <h2 className="mn-script">{invite.priaLengkap || invite.pria}</h2>
                <p className="mn-from">{dari("Putra", invite.urutanPria)}</p>
                <Divider />
                <p className="mn-ortu">{invite.ayahPria} &amp; {invite.ibuPria}</p>
                <IgLink username={invite.igPria} label={invite.pria} />
              </Bg>

              <section className="mn-save">
                <p className="mn-script mid">Save the Date</p>
                <Countdown iso={invite.tanggalAkad} units="short" />
                <a className="mn-btn light" href={cal} target="_blank" rel="noreferrer">Simpan Tanggal</a>
              </section>

              <Bg photo={photos.events} className="mn-events">
                <div className="mn-card">
                  <h3 className="mn-script mid">Akad</h3>
                  <p>{tanggal}</p>
                  <p>{invite.waktuAkad}</p>
                  <Divider />
                  <p className="mn-place">{invite.tempatAkad}<br />{invite.alamatAkad}</p>
                  <a className="mn-btn" href={invite.mapsAkad || mapsUrl(invite.tempatAkad, invite.alamatAkad)} target="_blank" rel="noreferrer">Lihat Lokasi</a>
                </div>
                <div className="mn-card">
                  <h3 className="mn-script mid">Resepsi</h3>
                  <p>{tglResepsi}</p>
                  <p>{invite.waktuResepsi}</p>
                  <Divider />
                  <p className="mn-place">{invite.tempatResepsi}<br />{invite.alamatResepsi}</p>
                  <a className="mn-btn" href={(sama ? invite.mapsAkad : invite.mapsResepsi) || mapsUrl(invite.tempatResepsi, invite.alamatResepsi)} target="_blank" rel="noreferrer">Lihat Lokasi</a>
                </div>
              </Bg>

              {invite.liveOn !== false && (
                <section className="mn-live">
                  <p className="mn-script mid">Live Streaming</p>
                  <p className="mn-date">{tanggal}</p>
                  <p>{invite.liveWaktu || invite.waktuAkad}</p>
                  <p className="mn-copy">Moment bahagia prosesi pernikahan akan kami tayangkan secara virtual melalui platform berikut ini.</p>
                  <a className="mn-btn light" href={invite.liveLink || "#"} target="_blank" rel="noreferrer">Join Streaming</a>
                </section>
              )}

              {invite.loveOn !== false && story.length > 0 && (
                <Bg photo={photos.love} className="mn-story">
                  <div className="mn-story-inner">
                    <p className="mn-script mid">Love Story</p>
                    <ol>
                      {story.map((s, i) => (
                        <li key={i}>
                          <b>{s.judul}{s.tahun ? `, ${s.tahun}` : ""}</b>
                          <span>{s.teks}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Bg>
              )}

              <section className="mn-gift">
                <p className="mn-script mid">Gift</p>
                <p className="mn-copy">Tanpa mengurangi rasa hormat, bagi tamu yang ingin mengirimkan hadiah kepada kami dapat mengirimkannya melalui:</p>

                {hasBank && hasKado && (
                  <div className="mn-gift-nav">
                    <button
                      type="button"
                      className={giftTab === "bank" ? "mn-gtab on" : "mn-gtab"}
                      onClick={() => setGiftTab("bank")}
                    >
                      <span className="material-symbols-outlined">credit_card</span>
                      <span>Transfer Bank</span>
                    </button>
                    <button
                      type="button"
                      className={giftTab === "kado" ? "mn-gtab on" : "mn-gtab"}
                      onClick={() => setGiftTab("kado")}
                    >
                      <span className="material-symbols-outlined">card_giftcard</span>
                      <span>Kirim Kado</span>
                    </button>
                  </div>
                )}

                <div className="mn-gift-content">
                  {(!hasKado || giftTab === "bank") && hasBank && (
                    <div className="mn-bank-list">
                      <RekeningItem label="Mempelai Wanita" bank={invite.bankNamaWanita} rek={invite.bankRekWanita} nama={invite.bankAnWanita} />
                      <RekeningItem label="Mempelai Pria" bank={invite.bankNamaPria} rek={invite.bankRekPria} nama={invite.bankAnPria} />
                    </div>
                  )}

                  {(!hasBank || giftTab === "kado") && hasKado && (
                    <div className="mn-kado-list">
                      <AlamatKadoItem rumah={invite.giftRumah} alamat={invite.alamatKado} />
                    </div>
                  )}
                </div>
              </section>

              <Bg photo={photos.close} className="mn-thanks">
                <p className="mn-script mid">Thank You</p>
                <p className="mn-copy">Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.</p>

                <a
                  className="mn-brand-badge"
                  href={import.meta.env.BASE_URL}
                  target="_blank"
                  rel="noreferrer"
                  title="Kunjungi Bersemi"
                >
                  <div className="mn-brand-badge-main">
                    <img
                      src={`${import.meta.env.BASE_URL}bersemi.svg`}
                      alt="Bersemi"
                      className="mn-brand-badge-logo"
                      draggable="false"
                    />
                    <span className="mn-brand-badge-title">Dibuat dengan Bersemi</span>
                    <span className="material-symbols-outlined mn-brand-badge-arrow">arrow_outward</span>
                  </div>
                  <p className="mn-brand-badge-tag">Pilih tema, modifikasi, selesai.</p>
                </a>
              </Bg>
            </div>
          )}

          {tab === "ucapan" && (
            <div className="mn-tab-content">
              <Bg photo={photos.rsvp} className="mn-rsvp mn-rsvp-standalone">
                <p className="mn-small">Buku Tamu</p>
                <p className="mn-script mid">Rsvp &amp; Doa</p>
                <Divider />
                <div className="mn-row">
                  <button type="button" className={rsvp.hadir === true ? "on" : ""} onClick={() => onRsvp("hadir", true)}>Hadir</button>
                  <button type="button" className={rsvp.hadir === false ? "on" : ""} onClick={() => onRsvp("hadir", false)}>Tidak Hadir</button>
                </div>
                <input value={rsvp.nama} onChange={(e) => onRsvp("nama", e.target.value)} placeholder="Nama Lengkap" />
                <textarea value={rsvp.ucapan || ""} onChange={(e) => onRsvp("ucapan", e.target.value)} placeholder="Tuliskan ucapan dan doa restu..." rows={4} />
                <button type="button" className="mn-btn full" onClick={sendRsvp}>Kirim Ucapan</button>
                {rsvp.note && <p className="mn-note">{rsvp.note}</p>}
                
                <div className="mn-wishes-wrap">
                  <p className="mn-wishes-count">{wishes.length} Ucapan dari Tamu</p>
                  <ul className="mn-list">
                    {wishes.map((w, i) => (
                      <li key={i}><b>{w.nama}</b><span>{w.teks}</span></li>
                    ))}
                  </ul>
                  {wishes.length === 0 && (
                    <p className="mn-wishes-empty">Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</p>
                  )}
                </div>
              </Bg>
            </div>
          )}

          {tab === "galeri" && (
            <div className="mn-tab-content">
              <section className="mn-moments mn-moments-standalone">
                <p className="mn-small">Momen Bahagia</p>
                <h2 className="mn-script mid">{invite.wanita} &amp; {invite.pria}</h2>
                <Divider />
                <div className="mn-grid">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={g[i]?.url ? "mn-shot" : "mn-shot empty"}>
                      {g[i]?.url ? <img src={g[i].url} alt="" /> : <span>{i + 1}</span>}
                    </div>
                  ))}
                </div>

                <div className="mn-guest-section">
                  <p className="mn-small">Momen Bersama</p>
                  <h3 className="mn-script mid">Tamu Undangan</h3>
                  <Divider />

                  <div className="mn-grid mn-guest-grid">
                    {guestMoments.map((m) => {
                      const p = m.photo || (m.photos && m.photos[0])
                      return (
                        <div
                          key={m.id}
                          className="mn-shot mn-guest-shot"
                          onClick={() => setSelectedMoment(m)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Lihat foto momen dari ${m.nama}`}
                        >
                          {p ? (
                            <img src={p} alt={`Momen dari ${m.nama}`} loading="lazy" />
                          ) : (
                            <span>Foto Tamu</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {guestMoments.length === 0 && (
                    <p className="mn-guest-empty">
                      Belum ada foto momen tamu. Jadilah yang pertama membagikan momen!
                    </p>
                  )}
                </div>
              </section>

              {/* Tombol Unggah Melayang di Pojok Kanan */}
              {hasUploaded ? (
                <button
                  type="button"
                  className="mn-float-cam done"
                  onClick={handleResetUpload}
                  title="Foto Anda terkirim. Klik untuk reset uji coba"
                  aria-label="Foto Anda terkirim. Klik untuk reset uji coba"
                >
                  <span className="material-symbols-outlined">check</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="mn-float-cam"
                  onClick={() => setUploadModalOpen(true)}
                  title="Unggah Foto Momen"
                  aria-label="Unggah Foto Momen"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                </button>
              )}

              <GuestUploadModal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                defaultName={invite.guest && invite.guest !== "Tamu Undangan" ? invite.guest : ""}
                onAddMoment={handleAddMoment}
                isEventStarted={isEventStarted}
                tanggalAkad={tanggal}
              />

              <MomentDetailModal
                moment={selectedMoment}
                onClose={() => setSelectedMoment(null)}
              />
            </div>
          )}

          <nav className="mn-nav" aria-label="Menu navigasi undangan">
            <button
              type="button"
              className={tab === "undangan" ? "mn-nav-item on" : "mn-nav-item"}
              onClick={() => switchTab("undangan")}
            >
              <span className="material-symbols-outlined">auto_stories</span>
              <span>Undangan</span>
            </button>
            <button
              type="button"
              className={tab === "ucapan" ? "mn-nav-item on" : "mn-nav-item"}
              onClick={() => switchTab("ucapan")}
            >
              <span className="material-symbols-outlined">sms</span>
              <span>Ucapan</span>
            </button>
            <button
              type="button"
              className={tab === "galeri" ? "mn-nav-item on" : "mn-nav-item"}
              onClick={() => switchTab("galeri")}
            >
              <span className="material-symbols-outlined">photo_library</span>
              <span>Galeri</span>
            </button>
          </nav>
        </>
      )}
    </article>
  )
}
