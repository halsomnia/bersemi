import { formatTanggalPanjang } from "../data/demoInvite"
import "./InviteFrame.css"

export default function InviteFrame({ invite, photos, children }) {
  const cover = photos?.cover?.url || photos?.hero?.url || photos?.ayat?.url
  const tanggal = formatTanggalPanjang(invite?.tanggal)
  const style = cover ? { backgroundImage: `url(${cover})` } : undefined

  return (
    <div className="invite-frame">
      <aside className="invite-stage" style={style} aria-hidden="true">
        <div className="invite-stage-veil" />
        <div className="invite-stage-copy">
          <p className="invite-stage-kicker">The Wedding of</p>
          <h2>{invite?.wanita} &amp; {invite?.pria}</h2>
          {tanggal ? <p className="invite-stage-date">{tanggal}</p> : null}
        </div>
      </aside>
      <div className="invite-scroll">{children}</div>
    </div>
  )
}
