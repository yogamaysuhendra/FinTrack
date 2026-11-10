# FinTrack Front-End

FinTrack adalah prototipe aplikasi pengelolaan keuangan pribadi menggunakan React, Vite, Tailwind CSS, Lucide React, dan Recharts.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite (biasanya `http://localhost:5173`).

## Login demo

- Email: `demo@fintrack.local`
- Password: `fintrack123`

Form login/register pada versi ini hanya simulasi front-end. Validasi dilakukan di browser dan sesi disimpan di `localStorage`; belum ada autentikasi aman atau koneksi ke Laravel/MySQL.

## Fitur prototipe

- Login dan register simulasi, dengan halaman login sebelum dashboard.
- Dashboard dengan saldo, ringkasan pemasukan/pengeluaran, arus kas, dan komposisi pengeluaran.
- Transaksi: tambah, edit, hapus, pencarian, dan filter jenis transaksi.
- Dompet: tambah dan hapus dompet.
- Anggaran: tambah/hapus anggaran dan hitung realisasi per kategori.
- Target tabungan: tambah target dan catat penambahan tabungan.
- Laporan: ringkasan, grafik kategori, dan ekspor CSV.
- Pengaturan profil dan reset data demo.
- Data prototipe disimpan di localStorage browser.

## Catatan integrasi back-end

Aplikasi belum terhubung ke API. Saat back-end Laravel siap, ganti simulasi login dengan autentikasi API (misalnya Laravel Sanctum), lalu pindahkan operasi baca/tulis data dari `localStorage` ke endpoint REST API. Jangan menggunakan autentikasi demo untuk produksi.
