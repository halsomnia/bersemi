import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Studio from "./pages/Studio"

export default function App() {
  return (
    <BrowserRouter basename="/bersemi">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio/:id" element={<Studio />} />
      </Routes>
    </BrowserRouter>
  )
}