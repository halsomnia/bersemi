const songs = [
  { id: "piano", name: "Piano", file: "music/hitam-putih.mp3" },
  { id: "sinden", name: "Sinden", file: "music/tema-2.mp3" },
]

const tema3Pack = {
  layout: "tema-3",
  music: "/music/hitam-putih.mp3",
  palettes: [
    { id: "navy", name: "Navy", font: 0, colors: { bg: "#0e1a2b", surface: "#f4efe6", ink: "#1a1a1a", accent: "#c4a574", mute: "#6e675c", line: "#e0d6c8", overlay: "rgba(14, 26, 43, 0.4)" } },
    { id: "maroon", name: "Maroon", font: 1, colors: { bg: "#4a1c1c", surface: "#f6ede4", ink: "#2a1614", accent: "#c4a574", mute: "#7a5e56", line: "#e4d4c8", overlay: "rgba(74, 28, 28, 0.4)" } },
  ],
  inks: [
    { id: "navy", name: "Navy", hex: "#0e1a2b" },
    { id: "maroon", name: "Maroon", hex: "#4a1c1c" },
  ],
  fonts: [
    { id: "tiket", name: "Tiket", display: "Great Vibes", title: "Playfair Display", body: "Source Serif 4" },
    { id: "pos", name: "Pos", display: "Allura", title: "Cormorant Garamond", body: "Lora" },
    { id: "paspor", name: "Paspor", display: "Pinyon Script", title: "Cinzel", body: "Source Serif 4" },
  ],
  songs,
}

export const catalogs = [
  {
    id: "tema-3",
    name: "Tema 3",
    category: "nikah",
    style: "tiket",
    desc: "Boarding pass navy.",
    price: 89000,
    promoPrice: 119000,
    promo: true,
    active: true,
    thumb: "tema3",
    ...tema3Pack,
  },
]

export function getCatalog(id) {
  return catalogs.find((c) => c.id === id)
}
