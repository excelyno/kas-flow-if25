# Google Form Pengeluaran

Project ini sudah disiapkan untuk membaca data pengeluaran dari Google Sheet publik. Cara input yang paling rapi adalah memakai Google Form, lalu responsnya otomatis masuk ke Sheet.

## Link Aktif

Link hasil generate terakhir:

- Form untuk diisi: https://docs.google.com/forms/d/e/1FAIpQLSe-7ZfUkIWx26KsVNXni8i48lrOxvlwYiiAVoU5pINJzPz5Rw/viewform
- Form edit: https://docs.google.com/forms/d/1Hvod01k90PnfMBSIfmhzZ0719JbuvXBaa7J3nBBnhTA/edit
- Response spreadsheet: https://docs.google.com/spreadsheets/d/1XnTVkCjF62gXDlgLJ4dr7m8RPci1iZVsiUNTW3thS7s/edit?usp=sharing
- Spreadsheet ID: `1XnTVkCjF62gXDlgLJ4dr7m8RPci1iZVsiUNTW3thS7s`

## Membuat Form Otomatis

1. Buka `https://script.google.com`.
2. Buat project baru.
3. Copy isi file `scripts/create-expense-form.gs`.
4. Paste ke editor Apps Script.
5. Ubah `SEMESTERS` jika semester yang aktif bukan `Semester 2`.
6. Jalankan fungsi `createExpenseForm`.
7. Izinkan akses Google yang diminta.
8. Buka log Apps Script untuk mengambil:
   - Form edit URL
   - Form public URL
   - Response spreadsheet URL
   - Spreadsheet ID

## Menghubungkan ke Website

Setelah form dibuat, buka file:

```txt
config/semesters.ts
```

Ubah bagian `expenseSheet.spreadsheetId` dengan Spreadsheet ID dari log Apps Script.

Contoh:

```ts
expenseSheet: {
  spreadsheetId: "SPREADSHEET_ID_DARI_LOG",
  gid: "0",
  sheetName: "Form Responses 1",
},
```

Pastikan response Sheet bisa dibaca publik:

```txt
Share -> General access -> Anyone with the link -> Viewer
```

Kalau website menampilkan error:

```txt
Google Sheet tidak bisa dibaca (404)
```

Artinya response spreadsheet biasanya masih private atau nama tab response tidak cocok.

Solusi cepat:

1. Buka `scripts/create-expense-form.gs` di Apps Script.
2. Paste versi terbaru dari repo ini.
3. Jalankan fungsi `shareCurrentExpenseSpreadsheet`.
4. Refresh website.

Alternatif manual:

1. Buka response spreadsheet:
   `https://docs.google.com/spreadsheets/d/1XnTVkCjF62gXDlgLJ4dr7m8RPci1iZVsiUNTW3thS7s/edit?usp=sharing`
2. Klik `Share`.
3. Ubah `General access` menjadi `Anyone with the link`.
4. Role tetap `Viewer`.
5. Refresh website.

## Field Yang Dibuat

Form otomatis membuat field berikut:

- Tanggal Pengeluaran
- Semester
- Kategori
- Keperluan / Keterangan
- Jumlah / Nominal
- Link Bukti Pengeluaran
- Pengaju
- Catatan

Parser website saat ini sudah cocok dengan field utama:

- Tanggal
- Semester
- Keperluan
- Jumlah
- Bukti

Field kategori, pengaju, dan catatan disimpan di Sheet untuk kebutuhan audit lanjutan.
