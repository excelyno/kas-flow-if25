import { DataNotice, EmptyState, PageHeader, StatCard } from "@/components/FinanceUi";
import PaymentTable from "@/components/PaymentTable";
import SemesterSwitcher from "@/components/SemesterSwitcher";
import { formatRupiah } from "@/lib/currency";
import { getSelectedSemesterSummary, type SemesterSearchParams } from "@/lib/dashboard-data";

export const metadata = {
  title: "Pembayaran - Alur Kas IF25",
};

export default async function PembayaranPage({ searchParams }: { searchParams?: SemesterSearchParams }) {
  const { summaries, summary } = await getSelectedSemesterSummary(searchParams);

  if (!summary) {
    return <EmptyState title="Belum ada konfigurasi semester." description="Tambahkan semester di config/semesters.ts." />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Pembayaran"
        title="Status iuran mahasiswa"
        description="Cari mahasiswa, cek status lunas, dan buka bukti pembayaran dari satu tabel yang ringan."
        action={<SemesterSwitcher summaries={summaries} selectedSemesterId={summary.semester.id} />}
      />

      <DataNotice summary={summary} />

      <section className="statsGrid" aria-label="Ringkasan pembayaran">
        <StatCard
          label="Sudah Bayar"
          value={`${summary.paidCount} orang`}
          caption={`${summary.progress}% dari total mahasiswa`}
          tone="income"
        />
        <StatCard
          label="Belum Bayar"
          value={`${summary.unpaidCount} orang`}
          caption="Terdeteksi dari master NIM"
          tone="warning"
        />
        <StatCard
          label="Nominal Iuran"
          value={formatRupiah(summary.semester.cashAmount)}
          caption="Per mahasiswa per semester"
        />
        <StatCard
          label="Total Masuk"
          value={formatRupiah(summary.income)}
          caption={`${summary.paidCount} pembayaran tercatat`}
          tone="income"
        />
      </section>

      <section className="surface">
        <PaymentTable students={summary.students} />
      </section>
    </>
  );
}
