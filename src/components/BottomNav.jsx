import { NavLink } from "react-router-dom"
import "./BottomNav.css"

const TABS = [
  { to: "/", label: "Tema", icon: "grid_view", end: true },
  { to: "/pesanan", label: "Pesanan", icon: "receipt_long" },
  { to: "/bantuan", label: "Bantuan", icon: "help" },
]

export default function BottomNav() {
  return (
    <nav className="bnav" aria-label="Navigasi utama">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => (isActive ? "bnav-tab on" : "bnav-tab")}
        >
          <span className="material-symbols-outlined">{t.icon}</span>
          <span className="bnav-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
