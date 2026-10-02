// Satu-satunya tempat yang mengganti mode terang/gelap.
// Warna theme-color = --paper di index.css, supaya bar browser/Android menyatu dengan app.
const META_COLOR = { light: "#FAFAF9", dark: "#131110" }

export function getTheme() {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light"
}

export function applyTheme(mode, save = true) {
  const m = mode === "dark" ? "dark" : "light"
  document.documentElement.dataset.theme = m
  if (save) localStorage.setItem("theme", m)
  let meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement("meta")
    meta.name = "theme-color"
    document.head.appendChild(meta)
  }
  meta.content = META_COLOR[m]
}
