# Alur Kas IF25

Website transparansi alur kas IF25 berbasis Next.js. Data pembayaran dan pengeluaran dibaca langsung dari Google Sheet publik, sedangkan master data mahasiswa berasal dari file `NamaNIMIF25`.

## Cara menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Deploy ke Vercel

1. Upload folder project ini ke GitHub.
2. Import repository di Vercel.
3. Framework preset: Next.js.
4. Deploy.

Tidak perlu database dan tidak perlu environment variable untuk versi awal ini.

## Format Google Sheet pembayaran

Sheet pembayaran berasal dari Google Form. Minimal harus punya kolom:

- `Nama Lengkap`
- `NIM`
- `Bukti pembayaran` atau kolom yang mengandung kata `Bukti`
- `Timestamp` untuk tanggal/waktu bayar

Deteksi sudah/belum bayar menggunakan NIM.

## Format Google Sheet pengeluaran

Isi baris pertama Google Sheet pengeluaran dengan header:

```text
Tanggal | Semester | Keperluan | Jumlah | Bukti
```

Contoh isi:

```text
2026-06-01 | Semester 2 | Beli air mineral | 50000 | https://drive.google.com/...
```

Jika sheet masih kosong, website tetap berjalan dan menampilkan pesan bahwa belum ada pengeluaran.

## Menambahkan semester baru

Edit file:

```text
config/semesters.ts
```

Tambahkan object baru di array `semesters`:

```ts
{
  id: "semester-3",
  name: "Semester 3",
  cashAmount: 15000,
  paymentSheet: {
    spreadsheetId: "ID_SPREADSHEET_PEMBAYARAN_SEMESTER_3",
    gid: "GID_SHEET",
  },
  expenseSheet: {
    spreadsheetId: "1YVAOxmJOaaSJVbn_dnodAwn2Y-fYw0LnKOE5IlXn-WA",
    gid: "0",
  },
  isActive: false,
}
```

Ubah `isActive: true` ke semester yang ingin dijadikan default.

## Catatan akses Google Sheet

Pastikan semua Google Sheet yang dibaca website diset:

```text
Share -> General access -> Anyone with the link -> Viewer
```
