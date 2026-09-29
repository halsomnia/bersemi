import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Home from "./pages/Home"
import Studio from "./pages/Studio"
import PesananSaya from "./pages/PesananSaya"
import Bantuan from "./pages/Bantuan"
import BottomNav from "./components/BottomNav"
import SideNav from "./components/SideNav"
import { applyTheme, getTheme } from "./lib/theme"

function Shell() {
  const location = useLocation()
  const showNav = !location.pathname.startsWith("/studio")

  return (
    <div className={showNav ? "app-shell" : undefined}>
      {showNav && <SideNav />}
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tema" element={<Navigate to="/" replace />} />
          <Route path="/pesanan" element={<PesananSaya />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/studio/:id" element={<Studio />} />
        </Routes>
        {showNav && <BottomNav />}
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    applyTheme(getTheme(), false)
  }, [])

  return (
    <BrowserRouter basename="/bersemi">
      <Shell />
    </BrowserRouter>
  )
}
