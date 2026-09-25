import "./EditDot.css"

export default function EditDot({ editing, onClick, light = false }) {
  if (!editing) return null
  return (
    <button
      type="button"
      className={light ? "edit-dot light" : "edit-dot"}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      aria-label="Ubah"
    >
      <span className="material-symbols-outlined">edit</span>
    </button>
  )
}
