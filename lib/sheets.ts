import type { SemesterConfig } from "@/config/semesters";

export type PaymentRecord = {
  nim: string;
  nameInput: string;
  timestamp?: string;
  proofUrl?: string;
  raw: Record<string, string>;
};

export type ExpenseRecord = {
  date: string;
  semester: string;
  category?: string;
  title: string;
  amount: number;
  proofUrl?: string;
  submitter?: string;
  note?: string;
};

export type SemesterDataset = {
  semesterId: string;
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  errors: string[];
};

function csvExportUrl(spreadsheetId: string, gid: string, sheetName?: string): string {
  if (sheetName) {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  }

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(current.trim());
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  row.push(current.trim());
  if (row.some((cell) => cell !== "")) rows.push(row);
  return rows;
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return [];
  const headers = rows[0].map((header, index) => normalizeKey(header || `kolom ${index + 1}`));
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? "";
    });
    return obj;
  });
}

function pick(row: Record<string, string>, candidates: string[]): string {
  const keys = Object.keys(row);
  for (const candidate of candidates.map(normalizeKey)) {
    const exact = keys.find((key) => key === candidate);
    if (exact) return row[exact];
  }
  for (const candidate of candidates.map(normalizeKey)) {
    const partial = keys.find((key) => key.includes(candidate) || candidate.includes(key));
    if (partial) return row[partial];
  }
  return "";
}

function cleanNim(value: string): string {
  const match = value.match(/\d{9,}/);
  return match ? match[0] : value.trim();
}

function parseAmount(value: string): number {
  const cleaned = value.replace(/[^0-9,-]/g, "").replace(/,/g, ".");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchCsv(spreadsheetId: string, gid: string, sheetName?: string): Promise<string> {
  const response = await fetch(csvExportUrl(spreadsheetId, gid, sheetName), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Sheet tidak bisa dibaca (${response.status}). Pastikan aksesnya Anyone with the link can view.`);
  }

  return response.text();
}

export async function getSemesterDataset(semester: SemesterConfig): Promise<SemesterDataset> {
  const errors: string[] = [];
  let payments: PaymentRecord[] = [];
  let expenses: ExpenseRecord[] = [];

  try {
    const paymentCsv = await fetchCsv(
      semester.paymentSheet.spreadsheetId,
      semester.paymentSheet.gid,
      semester.paymentSheet.sheetName,
    );
    const rows = rowsToObjects(parseCsv(paymentCsv));
    payments = rows
      .map((row) => ({
        nim: cleanNim(pick(row, ["NIM", "Nomor Induk Mahasiswa"])),
        nameInput: pick(row, ["Nama Lengkap", "Nama", "Name"]),
        timestamp: pick(row, ["Timestamp", "Waktu", "Tanggal"]),
        proofUrl: pick(row, ["Bukti pembayaran", "Bukti", "Upload bukti", "Link bukti"]),
        raw: row,
      }))
      .filter((payment) => payment.nim !== "");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Gagal membaca spreadsheet pembayaran.");
  }

  try {
    const expenseCsv = await fetchCsv(
      semester.expenseSheet.spreadsheetId,
      semester.expenseSheet.gid,
      semester.expenseSheet.sheetName,
    );
    const rows = rowsToObjects(parseCsv(expenseCsv));
    expenses = rows
      .map((row) => ({
        date: pick(row, ["Tanggal Pengeluaran", "Tanggal", "Date", "Timestamp"]),
        semester: pick(row, ["Semester"]),
        category: pick(row, ["Kategori", "Category"]),
        title: pick(row, ["Keperluan / Keterangan", "Keperluan", "Keterangan", "Deskripsi", "Untuk apa"]),
        amount: parseAmount(pick(row, ["Jumlah / Nominal", "Jumlah", "Nominal", "Amount"])),
        proofUrl: pick(row, ["Link Bukti Pengeluaran", "Bukti", "Link Bukti", "Bukti Pengeluaran"]),
        submitter: pick(row, ["Pengaju", "Diajukan oleh", "Nama Pengaju"]),
        note: pick(row, ["Catatan", "Note", "Notes"]),
      }))
      .filter((expense) => expense.title !== "" || expense.amount > 0)
      .filter((expense) => {
        if (!expense.semester) return true;
        return normalizeKey(expense.semester) === normalizeKey(semester.name) || normalizeKey(expense.semester) === normalizeKey(semester.id);
      });
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Gagal membaca spreadsheet pengeluaran.");
  }

  return {
    semesterId: semester.id,
    payments,
    expenses,
    errors,
  };
}
