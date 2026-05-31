import { DataNotice, EmptyState, MetricRow, PageHeader, SectionHeader, StatCard } from "@/components/FinanceUi";
import RandomPicker from "@/components/RandomPicker";
import SemesterSwitcher from "@/components/SemesterSwitcher";
import { formatDate } from "@/lib/currency";
import { countProofs, getLatestPaymentTimestamp, getSelectedSemesterSummary, type SemesterSearchParams } from "@/lib/dashboard-data";

export const metadata = {
  title: "Audit - Alur Kas IF25",
};

function sheetUrl(spreadsheetId: string, gid: string, sheetName?: string) {
  if (sheetName) {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  }

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`;
}

export default async function AuditPage({ searchParams }: { searchParams?: SemesterSearchParams }) {
  const { summaries, summary } = await getSelectedSemesterSummary(searchParams);

  if (!summary) {
    return <EmptyState title="Belum ada konfigurasi semester." description="Tambahkan semester di config/semesters.ts." />;
  }

  const latestPayment = getLatestPaymentTimestamp(summary);
  const proofCount = countProofs(summary);

  return (
    <>
      <PageHeader
        eyebrow="Audit"
        title="Sumber data dan utilitas"
        description="Halaman ini menampilkan jejak sumber data, kondisi bukti, dan alat bantu kecil untuk kebutuhan kelas."
        action={<SemesterSwitcher summaries={summaries} selectedSemesterId={summary.semester.id} />}
      />

      <DataNotice summary={summary} />

      <section className="statsGrid" aria-label="Ringkasan audit">
        <StatCard
          label="Data Pembayaran"
          value={`${summary.paidCount} baris`}
          caption="Cocok berdasarkan NIM"
          tone="income"
        />
        <StatCard
          label="Data Pengeluaran"
          value={`${summary.expenses.length} baris`}
          caption="Difilter per semester"
          tone="expense"
        />
        <StatCard
          label="Bukti Tersedia"
          value={`${proofCount} bukti`}
          caption="Pembayaran dan pengeluaran"
        />
        <StatCard
          label="Error Data"
          value={`${summary.errors.length}`}
          caption="Masalah baca spreadsheet"
          tone={summary.errors.length === 0 ? "income" : "warning"}
        />
      </section>

      <section className="splitGrid">
        <article className="surface">
          <SectionHeader
            eyebrow="Source"
            title="Sumber spreadsheet"
            description="Website hanya membaca data. Sumber kebenaran tetap spreadsheet yang dikelola bendahara."
          />
          <div className="auditList">
            <MetricRow label="Semester" value={summary.semester.name} />
            <MetricRow label="Iuran per orang" value={`Rp ${summary.semester.cashAmount.toLocaleString("id-ID")}`} />
            <MetricRow label="Update pembayaran" value={latestPayment ? formatDate(latestPayment) : "Belum ada"} />
          </div>
          <div className="linkStack">
            <a
              href={sheetUrl(
                summary.semester.paymentSheet.spreadsheetId,
                summary.semester.paymentSheet.gid,
                summary.semester.paymentSheet.sheetName,
              )}
              target="_blank"
              rel="noreferrer"
            >
              Buka sheet pembayaran
            </a>
            <a
              href={sheetUrl(
                summary.semester.expenseSheet.spreadsheetId,
                summary.semester.expenseSheet.gid,
                summary.semester.expenseSheet.sheetName,
              )}
              target="_blank"
              rel="noreferrer"
            >
              Buka sheet pengeluaran
            </a>
          </div>
        </article>

        <article className="surface">
          <SectionHeader
            eyebrow="Utility"
            title="Random picker"
            description="Alat bantu untuk memilih mahasiswa secara acak tanpa mengganggu halaman utama."
          />
          <RandomPicker students={summary.students} />
        </article>
      </section>
    </>
  );
}
