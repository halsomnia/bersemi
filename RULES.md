RULE.md, dev.bat, dan upload.bat jangan di hapus, selalu sertakan pada folder ini.

# Bersemi — Aturan Baku

Sumber kebenaran. Kode yang bertentangan dengan dokumen ini yang harus diubah.
Revisi: sebut kode aturan (mis. **D-3**), catat di §11.

---

## 0. Peta file (ubah X → edit Y)

| Mau ubah | File |
|---|---|
| Warna, sudut, tinggi logo | `src/index.css` saja |
| Mode terang/gelap | `src/lib/theme.js` |
| Logo | `public/bersemi.svg` + `public/bersemi-mark.svg` + `src/components/Logo.jsx` |
| Nav bawah / samping, toggle mode (desktop) | `src/components/BottomNav.*` · `SideNav.*` |
| Bingkai desktop undangan | `src/components/InviteFrame.jsx` + `.css` |
| Katalog (`/`) | `src/pages/Home.jsx` + `.css` |
| Form Studio + dock | `src/pages/Studio.jsx` + `.css` |
| Pesanan / Bantuan | `src/pages/PesananSaya.*` / `Bantuan.*` |
| Daftar tema, harga, field ekstra | `src/data/catalogs.js` |
| Daftar musik (global, semua tema) | `src/data/songs.js` + `public/music/musik_1.mp3`, `musik_2.mp3` |
| Pemilih warna (Isi data + Pratinjau) | `src/components/ColorPicker.*` |
| Isi contoh undangan | `src/data/demoInvite.js` |
| Tampilan undangan | `src/themes/<nama>/` |
| Aturan produk | `RULES.md` |

Kirim hanya file yang berubah. Jangan full zip kecuali diminta.

---

## 1. Brand

| Kode | Aturan |
|---|---|
| B-1 | Nama: **Bersemi**. Tagline persis: **Pilih tema, modifikasi, selesai.** Tidak diparafrase. |
| B-2 | Aksen: `#B33434` dari `public/bersemi.svg`. |
| B-3 | `--hati` sama di terang dan gelap. Yang berganti hanya netral. |
| B-4 | Satu-satunya warna di UI app. Selain hitam/putih/abu = merah hati. Pengecualian: file tema undangan. |
| B-5 | Logo dari `public/bersemi.svg` apa adanya. Tinggi hanya `--logo-h`. Mark (glyph saja) di `public/bersemi-mark.svg`, diambil dari path pertama `bersemi.svg`; dipakai hanya di dalam search katalog. |
| B-6 | Repo: https://github.com/halsomnia/bersemi |
| B-7 | Dilarang `--hati-soft` dan `--hati-deep`. Tidak ada tint merah muda. |

Ide signature (jangan dikerjakan sebelum disetujui): mark hati-tunas untuk favicon/loading.

---

## 2. Token (`index.css` saja)

Terang: `--paper #FAFAF9` · `--surface #FFFFFF` · `--ink #1A1A1A` · `--mute #6A6A68` · `--line #E8E8E6`
Gelap: `--paper #131110` · `--surface #1D1A18` · `--ink #F3EEE8` · `--mute #A39D95` · `--line #322E2A`
Tetap: `--hati #B33434` · `--on-hati #FFFFFF`
Sudut: `--r-sm 10px` (tombol kecil, tab, search) · `--r-md 16px` · `--r-pill 999px`
Layout desktop: `--bar-h 64px` (tinggi baris atas) · `--col 600px` (lebar kolom isi)

Hex aplikasi hanya di `index.css` (D-10).

---

## 3. Desain

| Kode | Aturan |
|---|---|
| D-1 | Flat, minimalis, elegan. Bukan Material (tanpa pil solid aktif, tanpa ripple). |
| D-2 | Tanpa `box-shadow` pada elemen biasa. Pemisah: `0.5px solid var(--line)`. |
| D-3 | `--hati` hemat: teks/ikon aktif, satu tombol utama, harga. Bukan latar besar. |
| D-4 | Font UI: DM Sans. Font lain hanya di dalam tema undangan. |
| D-5 | Ikon Material Symbols **Outlined** (`FILL 0`). |
| D-6 | Sudut lewat token di atas. |
| D-7 | Tombol utama: `--hati` + `--on-hati` + pill. **Satu** per layar. |
| D-8 | Chip/filter kategori: latar transparan. Aktif = `--ink` + garis bawah 1px. **Promo** (bukan kategori): selalu `--hati` + ikon `sell`, di kiri, dipisah garis `0.5px`; aktif = garis bawah `--hati`. |
| D-9 | Gerak: opacity/geser max 150ms. Tidak bounce. |
| D-10 | Tidak ada hex di CSS app selain `index.css`. |
| D-11 | Desktop: bar atas setinggi `--bar-h` dan satu garis dengan baris logo sidebar. Search (Tema) atau judul (Pesanan, Bantuan, **rata tengah**) ada di bar itu. Isi di kolom tengah selebar `--col`, semua halaman sama. Kelas `.page-bar` dan `.page-body` (index.css). |
| D-12 | Sidebar: logo, ikon menu, tagline, dan tombol mode memakai satu tepi kiri (`--edge`). |

---

## 4. Halaman

| Kode | Aturan |
|---|---|
| P-1 | Tidak ada halaman landing. `/` = katalog tema. `/tema` redirect ke `/`. |
| P-2 | **Katalog**: satu bar search dengan mark logo di kiri (tanpa header logo terpisah), lalu tab kategori (Semua, Nikah, Lamaran, Ultah). Promo di kiri tab, hanya muncul jika ada tema promo, bukan kategori. Kartu: foto, nama, harga, kategori. Tagline hanya di sidebar desktop. |
| P-3 | **Studio Pratinjau**: undangan full-bleed. Dock 3 langkah. Tombol warna terpisah. Auto-hide dock saat scroll turun. |
| P-4 | **Isi data / Order**: kartu `--surface` + garis `0.5px` + `--r-md`. Header: ikon outlined `--hati` + judul. Input tanpa kotak, cukup garis pemisah. |
| P-5 | **Order**: cara pesan (O-8) + garansi 24 jam + ringkasan + satu tombol Order. |
| P-6 | **Pesanan Saya**: catatan perangkat ini, status apa adanya. Kosong = satu kartu (ikon, "Belum ada pesanan", satu kalimat) + **Lihat Tema**. HP: tanpa logo, judul besar rata kiri. |
| P-7 | **Bantuan**: FAQ sesuai O + garansi admin 24 jam, semua dalam satu kartu bergaris pemisah. Tanpa subjudul. Toggle mode (HP saja; desktop di sidebar). Footer tagline B-1. HP: tanpa logo, judul besar rata kiri. |

---

## 5. Navigasi

| Kode | Aturan |
|---|---|
| N-1 | Nav 3 item: Tema, Pesanan, Bantuan. HP = bawah, desktop = kiri. Hilang di Studio. Toggle mode terang/gelap: desktop = sidebar kiri bawah, HP = bagian Tampilan di Bantuan. |
| N-2 | HP: dock Studio sama seperti bottom nav. Desktop: dock jadi rail kiri. |
| N-3 | Tab aktif: warna `--hati` saja. Tanpa latar. |
| N-4 | HP: lebar 430px tengah. Desktop ≥900px: nav kiri 220px, isi max 1080px. |
| N-5 | Studio tanpa tombol back sendiri. |
| N-6 | HP Pratinjau: dock + warna auto-hide saat scroll turun. Desktop: rail selalu terlihat. |
| N-7 | Tombol warna Pratinjau terpisah dari dock. |
| N-8 | Preview tanpa bingkai HP. |
| N-9 | Padding bawah HP `calc(96px + var(--safe-bottom))`. Desktop tanpa bottom nav. |
| N-10 | Studio desktop: rail kiri (kerangka SideNav: 220px, logo di baris `--bar-h`, tagline + toggle mode di bawah) = Pratinjau / Isi data / Order. Pilihan perangkat Laptop (default) / Tablet / HP = sub-menu teks tepat di bawah Pratinjau, hanya saat Pratinjau aktif. HP: tanpa pilihan perangkat. Isi data/Order = preview + form kartu max ~460px. |
| N-11 | Undangan desktop v1: kiri tetap (foto cover + nama + tanggal), kanan scroll tema HP 430px. HP: kiri disembunyikan. Semua tema lewat `InviteFrame`. |

---

## 6. Alur pesan (tanpa login)

| Kode | Aturan |
|---|---|
| O-1 | Tema → isi data → Order. Tanpa akun. |
| O-2 | Pesanan: local storage dulu, nanti Supabase. |
| O-3 | Admin hubungi WA untuk tagihan. |
| O-4 | Bayar manual. Gateway ditunda. |
| O-5 | Setelah bayar, admin kirim link WA. |
| O-6 | WA bukan syarat mulai pesan. |
| O-7 | Pesanan Saya jujur: data perangkat ini, bukan tracking live. |
| O-8 | Teks cara pesan: Lengkapi data → Order → Tagihan admin (WA) → Link (WA). |
| O-9 | Garansi: 24 jam sejak link terkirim. Revisi teks/foto lewat admin, tanpa biaya. |

Nama tamu `?to=` setelah link live, bukan di form Studio.

---

## 7. Tema undangan

- App UI bukan tema. Palet/font/ornamen tema bebas (open source).
- Field ekstra tema di `catalogs.js` → `form.extras` / `form.photos` / `form.galleryCount`.
- **Tanggal**: form Akad dan Resepsi masing-masing punya tanggal; Resepsi punya tombol "Sama dengan akad" (default aktif). Yang tampil di cover, hero, save the date, countdown, kalender, dan live adalah **tanggal akad**. Kartu Resepsi memakai tanggal resepsi.
- **Putra/Putri**: pelanggan hanya mengetik urutan (pertama, kedua, dst); tampil "Putra pertama dari" + nama orang tua dari form. Tidak diisi otomatis.
- **Amplop**: dua rekening (wanita, pria) + alamat kirim kado fisik. Sisi rekening yang kosong tidak tampil.
- **Musik**: global untuk semua tema: Musik 1, Musik 2 (`musik_1.mp3`, `musik_2.mp3`) + Unggah. Bukan per tema.
- **Foto ayat**: tidak ada. Tidak ada slot unggah dan tidak ada strip foto di bawah ayat.
- **Footer tema**: logo `bersemi.svg` putih di pita merah, tanpa teks (pengecualian B-5 karena berada di file tema).
- **Minimal**: cover → wedding of → ayat → bride → groom → save the date + Google Calendar → akad/resepsi → live opsional → love story 2-4 opsional → galeri 6 → rsvp & doa → gift → thank you → footer Bersemi.
- Tema 3 sudah dihapus. Jangan dikembalikan tanpa keputusan baru.
- Selesaikan satu tema sebelum tema baru.

---

## 8. Roadmap

1. UI + local storage — jalan
2. Supabase + OTP WA/email — belum
3. Status admin dari tabel — belum
4. Payment gateway — ditunda

---

## 9. Jangan

- Parafrase tagline
- Dua tombol utama di satu layar
- `--hati-soft`, `--hati-deep`, shadow, ikon filled
- Halaman landing / tab Beranda
- Login pelanggan
- Tombol back palsu di Studio
- Status pesanan yang seolah live sebelum backend

---

## 10. Cek sebelum rilis

- [ ] Tagline B-1 persis di sidebar desktop dan Bantuan
- [ ] Satu CTA utama per layar
- [ ] Hex hanya di `index.css`; `--hati` tidak diubah di mode gelap
- [ ] Tidak ada `--hati-soft` / `box-shadow` di UI app
- [ ] Tab aktif tanpa latar
- [ ] Ikon outlined
- [ ] Dicek terang dan gelap

---

## 11. Catatan perubahan

| Tanggal | Perubahan |
|---|---|
| 2026-09-28 | Aturan bernomor. `--hati` dikunci. Nav/dock flat. |
| 2026-09-28 | Beranda dipangkas ke tagline + 1 CTA. `--hati-soft/--hati-deep` dihapus. Form kartu dirapikan. FAQ diselaraskan ke garansi admin 24 jam. Peta file ditambah. |
| 2026-09-28 | Desktop Opsi B (≥900px): SideNav, katalog 4 kolom. Undangan v1: InviteFrame kiri tetap / kanan scroll. |
| 2026-09-28 | `/` = katalog. Tab Beranda dihapus. Nav 3 item. `/tema` redirect. |
| 2026-10-02 | Katalog: logo masuk ke dalam search (mark), header logo dihapus. Promo dipisah dari kategori: kiri, merah + ikon `sell`, garis pemisah. Tab kategori aktif = `--ink` (revisi D-8, P-2). Search sudut `--r-sm`. |
| 2026-10-02 | Palet terang baru (putih bersih): paper `#FAFAF9`, ink `#1A1A1A`, mute `#6A6A68`, line `#E8E8E6`. Desktop: kolom tengah + bar atas sejajar logo (D-11, D-12), judul Pesanan/Bantuan rata tengah, toggle mode pindah ke sidebar kiri bawah (N-1, P-7). Mark logo di search disembunyikan di desktop. |
| 2026-10-02 | HP: logo dihapus dari Pesanan dan Bantuan, judul besar rata kiri. Bantuan tanpa subjudul "Pertanyaan Umum" dan "Tampilan", FAQ dalam satu kartu (P-6, P-7). |
| 2026-10-02 | Menu "Demo" diganti **Pratinjau** (P-3, N-6, N-7, N-10). Pilihan perangkat desktop: Laptop/Tablet/HP sebagai sub-menu di bawah Pratinjau (opsi A). Rail Studio disamakan dengan SideNav. |
| 2026-10-02 | Isi data: musik global (Musik 1/2 + Unggah, file `musik_1.mp3`/`musik_2.mp3`); picker warna buatan sendiri (sama di desktop dan HP), pil warna Pratinjau terbuka ke samping; Putra/Putri hanya urutan; form Urutan anak dan Tanggal acara dihapus (tanggal pindah ke Akad dan Resepsi, tampil tanggal akad); Amplop = dua rekening + alamat kado; Love story didesain ulang; foto ayat dihapus; footer = logo putih tanpa teks (§7). |
