import { Link } from "react-router-dom"
import Logo from "../components/Logo"
import "./Beranda.css"

const CARA = [
  { t: "Pilih tema", d: "Isi data di Studio" },
  { t: "Order", d: "Tanpa akun" },
  { t: "Tagihan", d: "Link lewat WA" },
]

export default function Beranda() {
  return (
    <div className="beranda">
      <header className="beranda-head">
        <Logo />
      </header>

      <section className="hero">
        <h1>Pilih tema, modifikasi, selesai.</h1>
        <Link className="hero-cta" to="/tema">Lihat Tema</Link>
      </section>

      <ol className="cara">
        {CARA.map((c, i) => (
          <li key={c.t}>
            <span className="num">{i + 1}</span>
            <span>
              <b>{c.t}</b>
              <small>{c.d}</small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
