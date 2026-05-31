/**
 * Google Apps Script untuk membuat Google Form pengeluaran kas IF25.
 *
 * Cara pakai:
 * 1. Buka https://script.google.com
 * 2. Buat project baru.
 * 3. Paste isi file ini.
 * 4. Ubah SEMESTERS jika perlu.
 * 5. Jalankan createExpenseForm().
 * 6. Buka View > Logs untuk melihat URL Form dan Spreadsheet.
 */

const FORM_TITLE = "Form Pengeluaran Kas IF25";
const RESPONSE_SHEET_TITLE = "Respon Pengeluaran Kas IF25";
const CURRENT_RESPONSE_SPREADSHEET_ID = "1XnTVkCjF62gXDlgLJ4dr7m8RPci1iZVsiUNTW3thS7s";

const SEMESTERS = ["Semester 2"];

const EXPENSE_CATEGORIES = [
  "Konsumsi",
  "Acara",
  "Perlengkapan",
  "Operasional",
  "Kas sosial",
  "Lainnya",
];

function createExpenseForm() {
  const spreadsheet = SpreadsheetApp.create(RESPONSE_SHEET_TITLE);
  const form = FormApp.create(FORM_TITLE);

  form.setDescription(
    "Form ini dipakai untuk mencatat pengeluaran kas IF25. Isi nominal dengan angka saja, dan upload bukti jika tersedia."
  );
  form.setConfirmationMessage("Pengeluaran berhasil dikirim. Data akan dicek oleh bendahara.");
  form.setAllowResponseEdits(true);
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  DriveApp.getFileById(spreadsheet.getId()).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  form.addDateItem()
    .setTitle("Tanggal Pengeluaran")
    .setRequired(true);

  form.addListItem()
    .setTitle("Semester")
    .setChoiceValues(SEMESTERS)
    .setRequired(true);

  form.addListItem()
    .setTitle("Kategori")
    .setChoiceValues(EXPENSE_CATEGORIES)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Keperluan / Keterangan")
    .setHelpText("Contoh: Beli air mineral untuk kegiatan kelas.")
    .setRequired(true);

  const amountValidation = FormApp.createTextValidation()
    .requireNumberGreaterThan(0)
    .setHelpText("Isi angka saja. Contoh: 50000")
    .build();

  form.addTextItem()
    .setTitle("Jumlah / Nominal")
    .setHelpText("Isi angka saja. Contoh: 50000")
    .setValidation(amountValidation)
    .setRequired(true);

  form.addFileUploadItem()
    .setTitle("Link Bukti Pengeluaran")
    .setHelpText("Upload maksimal 1 file. Pastikan folder bukti bisa dibuka oleh yang punya akses laporan.")
    .setMaxFiles(1)
    .setMaxFileSize(10)
    .setRequired(false);

  form.addTextItem()
    .setTitle("Pengaju")
    .setHelpText("Nama orang yang mengajukan atau membayar pengeluaran.")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Catatan")
    .setHelpText("Opsional. Isi kalau ada konteks tambahan.")
    .setRequired(false);

  Logger.log("Form edit URL: " + form.getEditUrl());
  Logger.log("Form public URL: " + form.getPublishedUrl());
  Logger.log("Response spreadsheet URL: " + spreadsheet.getUrl());
  Logger.log("Spreadsheet ID untuk config/semesters.ts: " + spreadsheet.getId());
}

function shareCurrentExpenseSpreadsheet() {
  DriveApp.getFileById(CURRENT_RESPONSE_SPREADSHEET_ID)
    .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  Logger.log("Response spreadsheet sudah diset Anyone with the link -> Viewer.");
  Logger.log("Response spreadsheet URL: https://docs.google.com/spreadsheets/d/" + CURRENT_RESPONSE_SPREADSHEET_ID + "/edit");
}
