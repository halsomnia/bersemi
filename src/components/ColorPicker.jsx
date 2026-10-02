import { useState } from "react"
import "./ColorPicker.css"

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n))

function hexToHsv(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "")
  const n = parseInt(m ? m[1] : "0e1a2b", 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const d = max - Math.min(r, g, b)
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = (h * 60 + 360) % 360
  }
  return { h, s: max ? d / max : 0, v: max }
}

function hsvToHex({ h, s, v }) {
  const f = (n) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, "0")
  return `#${to(f(5))}${to(f(3))}${to(f(1))}`
}

function drag(onMove) {
  return {
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      onMove(e)
    },
    onPointerMove: (e) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) onMove(e)
    },
  }
}

// Pemilih warna buatan sendiri: tampilan dan cara pakai sama di desktop dan HP.
export default function ColorPicker({ value, onChange }) {
  const [hsv, setHsv] = useState(() => hexToHsv(value))
  const [draft, setDraft] = useState(null)

  // sinkron bila nilai berubah dari luar (mis. pilih swatch lain)
  const hex = hsvToHex(hsv)
  if (value && value.toLowerCase() !== hex.toLowerCase() && draft === null) {
    const next = hexToHsv(value)
    if (hsvToHex(next).toLowerCase() === value.toLowerCase()) setHsv(next)
  }

  function update(next) {
    setHsv(next)
    onChange(hsvToHex(next))
  }

  const onArea = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    update({ ...hsv, s: clamp((e.clientX - r.left) / r.width), v: 1 - clamp((e.clientY - r.top) / r.height) })
  }
  const onHue = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    update({ ...hsv, h: clamp((e.clientX - r.left) / r.width) * 360 })
  }
  const keyArea = (e) => {
    const step = e.shiftKey ? 0.1 : 0.02
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key]
    if (!d) return
    e.preventDefault()
    update({ ...hsv, s: clamp(hsv.s + d[0]), v: clamp(hsv.v + d[1]) })
  }
  const keyHue = (e) => {
    const d = { ArrowLeft: -6, ArrowDown: -6, ArrowRight: 6, ArrowUp: 6 }[e.key]
    if (!d) return
    e.preventDefault()
    update({ ...hsv, h: (hsv.h + d + 360) % 360 })
  }

  return (
    <div className="cp">
      <div
        className="cp-area"
        style={{ "--cp-h": hsv.h }}
        role="slider"
        tabIndex={0}
        aria-label="Kecerahan dan kepekatan warna"
        aria-valuetext={hex}
        onKeyDown={keyArea}
        {...drag(onArea)}
      >
        <i className="cp-knob" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }} />
      </div>
      <div
        className="cp-hue"
        role="slider"
        tabIndex={0}
        aria-label="Corak warna"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsv.h)}
        onKeyDown={keyHue}
        {...drag(onHue)}
      >
        <i className="cp-knob" style={{ left: `${(hsv.h / 360) * 100}%`, background: `hsl(${hsv.h} 100% 50%)` }} />
      </div>
      <label className="cp-hex">
        <span style={{ background: hex }} aria-hidden="true" />
        <input
          value={draft ?? hex}
          maxLength={7}
          spellCheck={false}
          autoCapitalize="off"
          aria-label="Kode warna hex"
          onChange={(e) => {
            const t = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`
            setDraft(t)
            if (/^#[0-9a-f]{6}$/i.test(t)) {
              const next = hexToHsv(t)
              setHsv(next)
              onChange(t.toLowerCase())
            }
          }}
          onBlur={() => setDraft(null)}
        />
      </label>
    </div>
  )
}
