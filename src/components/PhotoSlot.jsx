import { useId, useRef, useState } from "react"
import { compressPhoto } from "../lib/photos"
import "./PhotoSlot.css"

export default function PhotoSlot({
  label,
  hint = "Ketuk untuk pilih foto",
  photo,
  onChange,
  ratio = "3 / 4",
  compact = false,
}) {
  const id = useId()
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(file) {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const next = await compressPhoto(file)
      onChange(next)
    } catch (err) {
      setError(err.message || "Gagal membaca foto.")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className={compact ? "slot compact" : "slot"}>
      <label className="slot-frame" htmlFor={id} style={{ aspectRatio: ratio }}>
        {photo?.url ? (
          <img src={photo.url} alt={label} />
        ) : (
          <span className="slot-empty">
            <i aria-hidden="true" />
            <b>{label}</b>
            <small>{busy ? "Memampatkan…" : hint}</small>
          </span>
        )}
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
      {photo?.url && (
        <button
          type="button"
          className="slot-clear"
          onClick={() => onChange(null)}
        >
          Hapus
        </button>
      )}
      {error && <p className="slot-error">{error}</p>}
    </div>
  )
}
