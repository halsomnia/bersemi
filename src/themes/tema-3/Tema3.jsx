import Countdown from "../../components/Countdown"
import EditDot from "../../components/EditDot"
import MonthCal from "../../components/MonthCal"
import PhotoSlot from "../../components/PhotoSlot"
import { formatTanggalPanjang } from "../../data/demoInvite"
import "./Tema3.css"

function mapsUrl(place, address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} ${address}`)}`
}
function igUrl(handle) {
  const h = (handle || "").replace(/^@/, "")
  return h ? `https://instagram.com/${h}` : "#"
}
function Slot({ editing, photo, onChange, label, className, ratio = "4 / 3" }) {
  if (editing) return <PhotoSlot label={label} photo={photo} onChange={onChange} ratio={ratio} />
  if (photo?.url) return <div className={className}><img src={photo.url} alt="" /></div>
  return <div className={`${className} empty`}>{label}</div>
}
function stampDate(iso) {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return `${d}.${m}.${y}`
}

export default function Tema3({
  invite, photos, onPhoto, onEdit = () => {},
  open, onOpen, editing = false,
  rsvp, onRsvp, wishes = [], wishForm, onWish,
}) {
  const tanggal = formatTanggalPanjang(invite.tanggal, invite.hariLabel)
  const g = photos.gallery || []
  const initials = `${(invite.wanita || "A")[0]}${(invite.pria || "R")[0]}`.toUpperCase()

  return (
    <article className="t3">
      <section className="t3-cover">
        <div className="t3-ticket">
          <p className="t3-label">The Wedding of</p>
          <div className="t3-plane" aria-hidden="true">✈</div>
          <div className="t3-cover-space" />
          <p className="t3-to">Kepada Yth.</p>
          <p className="t3-guest">{invite.guest || "Tamu Undangan"}</p>
          {!open && (
            <button type="button" className="t3-open" onClick={onOpen}>Buka undangan</button>
          )}
        </div>
      </section>

      {open && (
        <>
          <section className="t3-pad">
            <div className="t3-ticket">
              <p className="t3-label">Boarding pass</p>
              <h1 className="t3-name">
                {invite.wanita}
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Nama",
                  fields: [{ key: "wanita", label: "Wanita" }, { key: "pria", label: "Pria" }],
                })} />
              </h1>
              <p className="t3-and">and</p>
              <h1 className="t3-name">{invite.pria}</h1>
              <div className="t3-meta">
                <div>
                  <span>Tanggal</span>
                  <b>{stampDate(invite.tanggal)}</b>
                </div>
                <div>
                  <span>Tempat</span>
                  <b>{invite.tempatResepsi}</b>
                </div>
              </div>
              <div className="t3-stamp">{initials}<small>{stampDate(invite.tanggal)}</small></div>
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket t3-copy">
              <p className="t3-arab">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
              <p>
                Assalamu’alaikum Warahmatullahi Wabarakatuh.
                Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i
                untuk hadir dalam acara pernikahan kami.
              </p>
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket">
              <Slot editing={editing} photo={photos.ayat} onChange={(f) => onPhoto("ayat", f)} label="Foto" className="t3-photo" />
              <blockquote>
                “{invite.ayat}”
                <cite>{invite.ayatRef}</cite>
              </blockquote>
            </div>
          </section>

          <section className="t3-pad t3-couple">
            <div className="t3-ticket t3-person">
              <Slot editing={editing} photo={photos.wanita} onChange={(f) => onPhoto("wanita", f)} label="Foto wanita" className="t3-photo portrait" ratio="3 / 4" />
              <p className="t3-label">Mempelai wanita</p>
              <h2>
                {invite.wanitaLengkap}
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Mempelai wanita",
                  fields: [
                    { key: "wanitaLengkap", label: "Nama lengkap" },
                    { key: "ayahWanita", label: "Ayah" },
                    { key: "ibuWanita", label: "Ibu" },
                    { key: "igWanita", label: "Instagram" },
                  ],
                })} />
              </h2>
              <p>Putri dari<br />{invite.ayahWanita}<br />&amp; {invite.ibuWanita}</p>
              {invite.igWanita && <a className="t3-ig" href={igUrl(invite.igWanita)} target="_blank" rel="noreferrer">@{invite.igWanita.replace(/^@/, "")}</a>}
            </div>
            <div className="t3-ticket t3-person">
              <Slot editing={editing} photo={photos.pria} onChange={(f) => onPhoto("pria", f)} label="Foto pria" className="t3-photo portrait" ratio="3 / 4" />
              <p className="t3-label">Mempelai pria</p>
              <h2>
                {invite.priaLengkap}
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Mempelai pria",
                  fields: [
                    { key: "priaLengkap", label: "Nama lengkap" },
                    { key: "ayahPria", label: "Ayah" },
                    { key: "ibuPria", label: "Ibu" },
                    { key: "igPria", label: "Instagram" },
                  ],
                })} />
              </h2>
              <p>Putra dari<br />{invite.ayahPria}<br />&amp; {invite.ibuPria}</p>
              {invite.igPria && <a className="t3-ig" href={igUrl(invite.igPria)} target="_blank" rel="noreferrer">@{invite.igPria.replace(/^@/, "")}</a>}
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket t3-save">
              <p className="t3-label">Save the date</p>
              <MonthCal iso={invite.tanggal} />
              <p className="t3-savedate">
                {stampDate(invite.tanggal)}
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Tanggal",
                  fields: [
                    { key: "tanggal", label: "Tanggal", type: "date" },
                    { key: "hariLabel", label: "Hari" },
                  ],
                })} />
              </p>
              <p className="t3-hari">{tanggal}</p>
              <Countdown iso={invite.tanggal} />
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket t3-event">
              <p className="t3-label">
                Akad nikah
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Akad nikah",
                  fields: [
                    { key: "waktuAkad", label: "Pukul" },
                    { key: "tempatAkad", label: "Tempat" },
                    { key: "alamatAkad", label: "Alamat" },
                  ],
                })} />
              </p>
              <h3>{invite.waktuAkad}</h3>
              <p>{invite.tempatAkad}</p>
              <p>{invite.alamatAkad}</p>
              <a className="t3-maps" href={mapsUrl(invite.tempatAkad, invite.alamatAkad)} target="_blank" rel="noreferrer">lihat maps</a>
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket t3-event">
              <p className="t3-label">
                Resepsi
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Resepsi",
                  fields: [
                    { key: "waktuResepsi", label: "Pukul" },
                    { key: "tempatResepsi", label: "Tempat" },
                    { key: "alamatResepsi", label: "Alamat" },
                  ],
                })} />
              </p>
              <Slot editing={editing} photo={photos.venue} onChange={(f) => onPhoto("venue", f)} label="Foto venue" className="t3-photo" ratio="16 / 10" />
              <h3>{invite.waktuResepsi}</h3>
              <p>{invite.tempatResepsi}</p>
              <p>{invite.alamatResepsi}</p>
              <a className="t3-maps" href={mapsUrl(invite.tempatResepsi, invite.alamatResepsi)} target="_blank" rel="noreferrer">lihat maps</a>
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket">
              <p className="t3-label">Galeri</p>
              <div className="t3-grid">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Slot key={i} editing={editing} photo={g[i]} onChange={(f) => onPhoto("gallery", f, i)} label={`${i + 1}`} className="t3-photo" ratio="1 / 1" />
                ))}
              </div>
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket t3-copy">
              <p className="t3-label">Wedding Gift</p>
              <p>
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
                Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat
                memberi kado secara cashless atau kirim kado.
              </p>
              <p className="t3-label gap">
                Transfer
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Rekening",
                  fields: [
                    { key: "bankNama", label: "Bank" },
                    { key: "bankRek", label: "Nomor rekening" },
                    { key: "bankAn", label: "Atas nama" },
                  ],
                })} />
              </p>
              <p>{invite.bankNama}</p>
              <strong>{invite.bankRek}</strong>
              <p>a.n. {invite.bankAn}</p>
              <p className="t3-label gap">
                Kirim kado
                <EditDot editing={editing} onClick={() => onEdit({
                  title: "Alamat kado",
                  fields: [{ key: "alamatKado", label: "Alamat", type: "textarea" }],
                })} />
              </p>
              <p>{invite.alamatKado}</p>
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket">
              <p className="t3-label">RSVP</p>
              <div className="t3-row">
                <button type="button" className={rsvp.hadir === true ? "on" : ""} onClick={() => onRsvp("hadir", true)}>Hadir</button>
                <button type="button" className={rsvp.hadir === false ? "on" : ""} onClick={() => onRsvp("hadir", false)}>Berhalangan</button>
              </div>
              <input value={rsvp.nama} onChange={(e) => onRsvp("nama", e.target.value)} placeholder="Nama Anda" />
              <button type="button" className="t3-send" onClick={() => onRsvp("kirim")}>Kirim konfirmasi</button>
              {rsvp.note && <p className="t3-note">{rsvp.note}</p>}
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket">
              <p className="t3-label">Ucapan</p>
              <input value={wishForm.nama} onChange={(e) => onWish("nama", e.target.value)} placeholder="Nama" />
              <textarea value={wishForm.teks} onChange={(e) => onWish("teks", e.target.value)} placeholder="Doa dan ucapan" rows={4} />
              <button type="button" className="t3-send" onClick={() => onWish("kirim")}>Kirim ucapan</button>
              {wishForm.note && <p className="t3-note">{wishForm.note}</p>}
              <ul className="t3-wishes">
                {wishes.map((w, i) => (
                  <li key={i}><b>{w.nama}</b><span>{w.teks}</span></li>
                ))}
              </ul>
            </div>
          </section>

          <section className="t3-pad">
            <div className="t3-ticket">
              <Slot editing={editing} photo={photos.close} onChange={(f) => onPhoto("close", f)} label="Foto penutup" className="t3-photo" />
              <p className="t3-copy">Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
              <p className="t3-and">{invite.wanita} and {invite.pria}</p>
            </div>
          </section>

          <footer className="t3-foot">
            <span>Dibuat dengan</span>
            <strong>Bersemi</strong>
          </footer>
        </>
      )}
    </article>
  )
}
