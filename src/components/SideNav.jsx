import { useState } from "react"
import { NavLink } from "react-router-dom"
import { applyTheme, getTheme } from "../lib/theme"
import Logo from "./Logo"
import "./SideNav.css"

const TABS = [
  { to: "/", label: "Tema", icon: "grid_view", end: true },
  { to: "/pesanan", label: "Pesanan", icon: "receipt_long" },
  { to: "/bantuan", label: "Bantuan", icon: "help" },
]

export default function SideNav() {
  const [theme, setTheme] = useState(getTheme)
  const dark = theme === "dark"
  const toggle = () => {
    const next = dark ? "light" : "dark"
    applyTheme(next)
    setTheme(next)
  }

  return (
    <aside className="sidenav" aria-label="Navigasi utama">
      <div className="sidenav-top"><Logo /></div>
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
      <div className="sidenav-foot">
        <p className="sidenav-tag">Pilih tema, modifikasi, selesai.</p>
        <button type="button" className="sidenav-tab sidenav-mode" onClick={toggle}>
          <span className="material-symbols-outlined">{dark ? "light_mode" : "dark_mode"}</span>
          <span>{dark ? "Mode terang" : "Mode gelap"}</span>
        </button>
      </div>
    </aside>
  )
}
