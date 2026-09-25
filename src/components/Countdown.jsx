import { useEffect, useState } from "react"

function split(ms) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 }
  const s = Math.floor(ms / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

export default function Countdown({ iso }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const target = iso ? new Date(`${iso}T00:00:00`).getTime() : NaN
  if (Number.isNaN(target)) return null
  const parts = split(target - now)

  return (
    <div className="hp-count">
      {[
        [parts.d, "Hari"],
        [parts.h, "Jam"],
        [parts.m, "Menit"],
        [parts.s, "Detik"],
      ].map(([n, label]) => (
        <div key={label} className="hp-count-cell">
          <strong>{String(n).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
