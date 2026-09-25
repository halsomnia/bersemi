# Aturan desain Bersemi

Dua lapisan. Jangan campur.

## A. Aplikasi (katalog, menu, tombol Edit/Order, popup, form order)

- Font: DM Sans. Wordmark **Bersemi** = DM Sans Bold.
- Ikon: Google Material Symbols Outlined.
- Warna app: kertas `--paper`, permukaan `--surface`, tinta `--ink`, senyap `--mute`, aksen hati `--hati` (#B33434).
- Mode terang/gelap hanya untuk chrome app, bukan isi undangan.
- Sudut: chip dan tombol app membulat (pill). Kartu katalog radius besar, tanpa garis tepi tebal.
- Palette / font tema tidak boleh mewarnai tombol app.

## B. Tema undangan (`src/themes/…`)

- Layout terkunci. Yang boleh diubah customer: data (nama, tanggal, alamat, rekening, foto).
- Yang tidak diubah customer: kerangka halaman, salam pembuka, teks ayat baku, blok RSVP, tombol peta/kalender.
- Nama tamu (`?to=`) tidak diedit di studio. Diisi per tautan setelah undangan live.
- Font, ikon, motif, foto stok, musik tema: boleh dari sumber open source / public domain / lisensi bebas, asal selaras arah tema.
- Warna tema lewat token CSS (`--bg --surface --ink --accent --mute --line --overlay`) yang hanya menempel di pembungkus pratinjau.
- Musik tema file statis di `public/music/{id-tema}.mp3`, bukan database.

## C. Studio

- Tema full screen. Tidak ada header app di atas undangan.
- Tombol app mengambang: kembali, musik, Edit/Selesai, Order.
- Mode Edit: Order mati sampai Selesai.
- Edit data lewat popup. Foto tetap unggah di slot.
- Satu tema selesai dulu sebelum tema baru.
