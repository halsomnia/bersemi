import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Logo from "../components/Logo"
import "./PesananSaya.css"

export const ORDERS_KEY = "bersemi-orders"
const STATUS_LABEL = { menunggu: "Menunggu tagihan dari admin", aktif: "Aktif", selesai: "Selesai" }

const rupiah = (n) => `Rp${Number(n || 0).toLocaleString("id-ID")}`

export default function PesananSaya() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY)
      setOrders(raw ? JSON.parse(raw) : [])
    } catch {
      setOrders([])
    }
  }, [])

  return (
    <div className="pesanan">
      <header className="pesanan-head">
        <Logo />
      </header>
      <h1 className="pesanan-title">Pesanan Saya</h1>
      <p className="pesanan-note">
        Catatan pesanan dari HP ini — bukan akun. Admin akan menghubungi lewat WhatsApp untuk tagihan dan link undangan.
      </p>

      {orders.length === 0 ? (
        <div className="pesanan-empty">
          <span className="material-symbols-outlined">receipt_long</span>
          <p>Belum ada pesanan.</p>
          <Link className="pesanan-cta" to="/">Lihat Tema</Link>
        </div>
      ) : (
        <ul className="pesanan-list">
          {orders.map((o) => (
            <li key={o.id} className="pesanan-card">
              <div className="pesanan-row1">
                <b>{o.temaNama}</b>
                <span className={`pesanan-status st-${o.status}`}>{STATUS_LABEL[o.status] || o.status}</span>
              </div>
              <p className="pesanan-couple">{o.pasangan}</p>
              <div className="pesanan-row2">
                <span>{o.pemesan}</span>
                <b>{rupiah(o.harga)}</b>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
