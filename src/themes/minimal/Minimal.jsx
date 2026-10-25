import { useState } from "react"
import Countdown from "../../components/Countdown"
import { formatTanggalPanjang, tanggalResepsiBerlaku } from "../../data/demoInvite"
import { googleCalendarUrl } from "../../lib/calendar"
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

function Rekening({ label, bank, rek, nama }) {
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
    <div className="mn-acc">
      <p className="mn-acc-label">{label}</p>
      <p className="mn-acc-bank">{bank}</p>
      <p className="mn-acc-no">{rek}</p>
      <p className="mn-acc-name">a.n. {nama}</p>
      <button type="button" className="mn-acc-copy" onClick={salin}>{ok ? "Tersalin" : "Salin nomor"}</button>
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
  const tanggal = formatTanggalPanjang(invite.tanggalAkad)
  const tglResepsi = formatTanggalPanjang(tanggalResepsiBerlaku(invite))
  const sama = invite.resepsiSama !== false
  const g = photos.gallery || []
  const story = (invite.loveStory || []).slice(0, 4)
  const cal = googleCalendarUrl(invite)

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
                  <a className="mn-btn" href={mapsUrl(invite.tempatAkad, invite.alamatAkad)} target="_blank" rel="noreferrer">Lihat Lokasi</a>
                </div>
                <div className="mn-card">
                  <h3 className="mn-script mid">Resepsi</h3>
                  <p>{tglResepsi}</p>
                  <p>{invite.waktuResepsi}</p>
                  <Divider />
                  <p className="mn-place">{invite.tempatResepsi}<br />{invite.alamatResepsi}</p>
                  <a className="mn-btn" href={mapsUrl(invite.tempatResepsi, invite.alamatResepsi)} target="_blank" rel="noreferrer">Lihat Lokasi</a>
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
                <div className="mn-accs">
                  <Rekening label="Mempelai Wanita" bank={invite.bankNamaWanita} rek={invite.bankRekWanita} nama={invite.bankAnWanita} />
                  <Rekening label="Mempelai Pria" bank={invite.bankNamaPria} rek={invite.bankRekPria} nama={invite.bankAnPria} />
                </div>
                {invite.alamatKado && (
                  <div className="mn-acc mn-addr">
                    <p className="mn-acc-label">Kirim Kado</p>
                    <p className="mn-acc-bank">{invite.giftRumah}</p>
                    <p className="mn-acc-name">{invite.alamatKado}</p>
                  </div>
                )}
              </section>

              <Bg photo={photos.close} className="mn-thanks">
                <p className="mn-script mid">Thank You</p>
                <p className="mn-copy">Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.</p>
              </Bg>

              <footer className="mn-foot">
                <img src={`${import.meta.env.BASE_URL}bersemi.svg`} alt="Bersemi" draggable="false" />
              </footer>
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
                <p className="mn-small">Koleksi Foto</p>
                <p className="mn-script mid">Our Moments</p>
                <Divider />
                <div className="mn-grid">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={g[i]?.url ? "mn-shot" : "mn-shot empty"}>
                      {g[i]?.url ? <img src={g[i].url} alt="" /> : <span>{i + 1}</span>}
                    </div>
                  ))}
                </div>
              </section>
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
