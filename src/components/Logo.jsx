export default function Logo({ className = "" }) {
  return (
    <img
      className={`brand-logo ${className}`}
      src={`${import.meta.env.BASE_URL}bersemi.svg`}
      alt="Bersemi"
    />
  )
}