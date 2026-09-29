export function googleCalendarUrl(invite) {
  const title = `Pernikahan ${invite.wanita || ""} & ${invite.pria || ""}`.trim()
  const day = (invite.tanggal || "").replace(/-/g, "")
  const dates = day ? `${day}/${nextDay(invite.tanggal)}` : ""
  const loc = [invite.tempatResepsi, invite.alamatResepsi].filter(Boolean).join(", ")
  const details = [
    invite.waktuAkad ? `Akad ${invite.waktuAkad} — ${invite.tempatAkad || ""}` : "",
    invite.waktuResepsi ? `Resepsi ${invite.waktuResepsi} — ${invite.tempatResepsi || ""}` : "",
  ].filter(Boolean).join("\n")
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details,
    location: loc,
  })
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}

function nextDay(iso) {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ""
  d.setDate(d.getDate() + 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}${m}${day}`
}
