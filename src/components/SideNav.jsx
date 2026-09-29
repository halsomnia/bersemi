import { NavLink } from "react-router-dom"
import Logo from "./Logo"
import "./SideNav.css"

const TABS = [
  { to: "/", label: "Tema", icon: "grid_view", end: true },
  { to: "/pesanan", label: "Pesanan", icon: "receipt_long" },
  { to: "/bantuan", label: "Bantuan", icon: "help" },
]

export default function SideNav() {
  return (
    <aside className="sidenav" aria-label="Navigasi utama">
      <Logo />
      <nav className="sidenav-list">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) => (isActive ? "sidenav-tab on" : "sidenav-tab")}
          >
            <span className="material-symbols-outlined">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
      <p className="sidenav-tag">Pilih tema, modifikasi, selesai.</p>
    </aside>
  )
}
