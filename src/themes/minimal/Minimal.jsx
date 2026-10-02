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

export default function Minimal({
  invite,
  photos,
  open,
  onOpen,
  rsvp,
  onRsvp,
  wishes = [],
}) {
  const tanggal = formatTanggalPanjang(invite.tanggalAkad)
  const tglResepsi = formatTanggalPanjang(tanggalResepsiBerlaku(invite))
  const sama = invite.resepsiSama !== false
  const g = photos.gallery || []
  const story = (invite.loveStory || []).slice(0, 4)
  const cal = googleCalendarUrl(invite)

  function sendRsvp() {
    onRsvp("kirim")
  }

  return (
    <article className="mn">
      <Bg photo={photos.cover} className="mn-cover">
        <p className="mn-small">Undangan Pernikahan</p>
        <h1 className="mn-script">{invite.wanita} &amp; {invite.pria}</h1>
        <p className="mn-date">{tanggal}</p>
        <div className="mn-moon" aria-hidden="true" />
        <div className="mn-cover-foot">
          <p className="mn-to">Kepada Yth.</p>
          <p className="mn-guest">{invite.guest || "Tamu Undangan"}</p>
          {!open && (
            <button type="button" className="mn-btn" onClick={onOpen}>Buka Undangan</button>
          )}
        </div>
      </Bg>

      {open && (
        <>
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
          </Bg>

          <Bg photo={photos.pria} className="mn-person">
            <p className="mn-small">The Groom</p>
            <h2 className="mn-script">{invite.priaLengkap || invite.pria}</h2>
            <p className="mn-from">{dari("Putra", invite.urutanPria)}</p>
            <Divider />
            <p className="mn-ortu">{invite.ayahPria} &amp; {invite.ibuPria}</p>
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

          <section className="mn-moments">
            <p className="mn-script mid">Our Moments</p>
            <div className="mn-grid">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={g[i]?.url ? "mn-shot" : "mn-shot empty"}>
                  {g[i]?.url ? <img src={g[i].url} alt="" /> : <span>{i + 1}</span>}
                </div>
              ))}
            </div>
          </section>

          <Bg photo={photos.rsvp} className="mn-rsvp">
            <p className="mn-script mid">Rsvp &amp; Doa</p>
            <div className="mn-row">
              <button type="button" className={rsvp.hadir === true ? "on" : ""} onClick={() => onRsvp("hadir", true)}>Hadir</button>
              <button type="button" className={rsvp.hadir === false ? "on" : ""} onClick={() => onRsvp("hadir", false)}>Tidak Hadir</button>
            </div>
            <input value={rsvp.nama} onChange={(e) => onRsvp("nama", e.target.value)} placeholder="Nama" />
            <textarea value={rsvp.ucapan || ""} onChange={(e) => onRsvp("ucapan", e.target.value)} placeholder="Doa & Ucapan" rows={3} />
            <button type="button" className="mn-btn full" onClick={sendRsvp}>Kirim</button>
            {rsvp.note && <p className="mn-note">{rsvp.note}</p>}
            <ul className="mn-list">
              {wishes.map((w, i) => (
                <li key={i}><b>{w.nama}</b><span>{w.teks}</span></li>
              ))}
            </ul>
          </Bg>

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
        </>
      )}
    </article>
  )
}
