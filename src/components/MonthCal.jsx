import "./MonthCal.css"

const DOW = ["S", "S", "R", "K", "J", "S", "M"]

export default function MonthCal({ iso }) {
  if (!iso) return null
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const y = date.getFullYear()
  const m = date.getMonth()
  const day = date.getDate()
  const monthName = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(date)
  const first = new Date(y, m, 1)
  const start = (first.getDay() + 6) % 7
  const days = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(start).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)

  return (
    <div className="mcal">
      <p className="mcal-month">{monthName}</p>
      <div className="mcal-grid">
        {DOW.map((d, i) => <span key={`d${i}`} className="mcal-dow">{d}</span>)}
        {cells.map((n, i) => (
          <span key={i} className={n === day ? "mcal-day on" : "mcal-day"}>{n || ""}</span>
        ))}
      </div>
    </div>
  )
}
