const minimalPack = {
  layout: "minimal",
  palettes: [
    { id: "malam", name: "Malam", font: 0, colors: { bg: "#070708", surface: "#141414", ink: "#f4efe8", accent: "#b33434", mute: "#a39b93", line: "#2a2a2a", overlay: "rgba(0,0,0,.45)" } },
  ],
  inks: [
    { id: "malam", name: "Malam", hex: "#070708" },
    { id: "hati", name: "Hati", hex: "#b33434" },
  ],
  fonts: [
    { id: "naskah", name: "Naskah", display: "Alex Brush", title: "Alex Brush", body: "Jost" },
  ],
  form: {
    extras: ["streaming", "loveStory"],
    galleryCount: 6,
    photos: [
      { key: "cover", title: "Cover", ratio: "9 / 16" },
      { key: "hero", title: "The Wedding of", ratio: "3 / 4" },
      { key: "wanita", title: "The Bride", ratio: "3 / 4" },
      { key: "pria", title: "The Groom", ratio: "3 / 4" },
      { key: "events", title: "Akad & resepsi", ratio: "3 / 4" },
      { key: "love", title: "Love story", ratio: "3 / 4" },
      { key: "rsvp", title: "Rsvp & doa", ratio: "3 / 4" },
      { key: "close", title: "Thank you", ratio: "3 / 4" },
    ],
  },
}

export const catalogs = [
  {
    id: "minimal",
    name: "Minimal",
    category: "nikah",
    style: "editorial",
    desc: "Gelap, foto penuh, naskah.",
    price: 89000,
    promoPrice: 119000,
    promo: true,
    active: true,
    thumb: "minimal",
    ...minimalPack,
  },
]

export function getCatalog(id) {
  return catalogs.find((c) => c.id === id)
}
