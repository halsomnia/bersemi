import "./CoverThumb.css"

export default function CoverThumb({ name = "Tema", couple = "Alya & Raka", variant = "editorial" }) {
  return (
    <div className={`thumb-cover ${variant}`} aria-hidden="true">
      <span className="thumb-kicker">The wedding of</span>
      <strong>{couple}</strong>
      <em>{name}</em>
    </div>
  )
}
