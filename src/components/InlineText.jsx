import "./InlineText.css"

export default function InlineText({
  editing,
  value,
  onChange,
  as: Tag = "span",
  className = "",
  placeholder = "",
  type = "text",
}) {
  if (!editing) {
    return <Tag className={className}>{value || placeholder}</Tag>
  }

  return (
    <Tag className={`${className} inline-edit`}>
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    </Tag>
  )
}
