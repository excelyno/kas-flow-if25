import { DataNotice, EmptyState, PageHeader, SectionHeader, StatCard } from "@/components/FinanceUi";
import SemesterSwitcher from "@/components/SemesterSwitcher";
import { formatDate, formatRupiah } from "@/lib/currency";
import { getSelectedSemesterSummary, type SemesterSearchParams } from "@/lib/dashboard-data";

export const metadata = {
  title: "Pengeluaran - Alur Kas IF25",
};

export default async function PengeluaranPage({ searchParams }: { searchParams?: SemesterSearchParams }) {
  const { summaries, summary } = await getSelectedSemesterSummary(searchParams);
  const averageExpense = summary?.expenses.length ? Math.round(summary.expenseTotal / summary.expenses.length) : 0;
  const expensesWithProof = summary?.expenses.filter((expense) => Boolean(expense.proofUrl)).length ?? 0;

  if (!summary) {
    return <EmptyState title="Belum ada konfigurasi semester." description="Tambahkan semester di config/semesters.ts." />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Pengeluaran"
        title="Uang kas dipakai untuk apa"
        description="Daftar pengeluaran dibuat fokus ke hal yang penting: tanggal, kebutuhan, nominal, dan bukti."
        action={<SemesterSwitcher summaries={summaries} selectedSemesterId={summary.semester.id} />}
      />

      <DataNotice summary={summary} />

      <section className="statsGrid" aria-label="Ringkasan pengeluaran">
        <StatCard
          label="Total Keluar"
          value={formatRupiah(summary.expenseTotal)}
          caption={`${summary.expenses.length} transaksi pengeluaran`}
          tone="expense"
        />
        <StatCard
          label="Rata-rata"
          value={formatRupiah(averageExpense)}
          caption="Per transaksi tercatat"
        />
        <StatCard
          label="Bukti"
          value={`${expensesWithProof} bukti`}
          caption="Lampiran pengeluaran"
          tone={expensesWithProof === summary.expenses.length ? "income" : "warning"}
        />
        <StatCard
          label="Sisa Saldo"
          value={formatRupiah(summary.balance)}
          caption="Pemasukan dikurangi pengeluaran"
          tone={summary.balance >= 0 ? "income" : "expense"}
        />
      </section>

      <section className="surface">
        <SectionHeader
          eyebrow="Ledger"
          title="Daftar pengeluaran"
          description="Urutan mengikuti data yang masuk dari spreadsheet."
        />

        {summary.expenses.length === 0 ? (
          <EmptyState
            title={`Belum ada pengeluaran untuk ${summary.semester.name}.`}
            description="Data akan tampil otomatis setelah spreadsheet pengeluaran diisi."
          />
        ) : (
          <div className="expenseLedger">
            {summary.expenses.map((expense, index) => (
              <article className="ledgerRow" key={`${expense.title}-${expense.date}-${index}`}>
                <div>
                  <span>
                    {formatDate(expense.date)}
                    {expense.category ? ` - ${expense.category}` : ""}
                  </span>
                  <strong>{expense.title}</strong>
                  {expense.submitter ? <span>Diajukan oleh {expense.submitter}</span> : null}
                  {expense.note ? <p className="ledgerNote">{expense.note}</p> : null}
                </div>
                <div className="ledgerMeta">
                  <strong>{formatRupiah(expense.amount)}</strong>
                  {expense.proofUrl ? (
                    <a href={expense.proofUrl} target="_blank" rel="noreferrer">Bukti</a>
                  ) : (
                    <span className="muted">Tanpa bukti</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
