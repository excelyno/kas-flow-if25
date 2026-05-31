import Link from "next/link";
import { DataNotice, MetricRow, SectionHeader, StatCard } from "@/components/FinanceUi";
import SemesterSwitcher from "@/components/SemesterSwitcher";
import { formatDate, formatRupiah } from "@/lib/currency";
import { countProofs, getLatestPaymentTimestamp } from "@/lib/dashboard-data";
import type { SemesterSummary } from "@/lib/summary";

function pageHref(path: string, semesterId: string) {
  return `${path}?semester=${encodeURIComponent(semesterId)}`;
}

export default function Dashboard({
  summaries,
  summary,
}: {
  summaries: SemesterSummary[];
  summary: SemesterSummary;
}) {
  const latestPayment = getLatestPaymentTimestamp(summary);
  const proofCount = countProofs(summary);
  const recentPaidStudents = summary.students.filter((student) => student.status === "paid").slice(0, 5);
  const recentExpenses = summary.expenses.slice(0, 4);

  return (
    <>
      <section className="overviewHero">
        <div className="heroCopy">
          <span className="eyebrow">Dashboard publik</span>
          <h1>Kas IF25, rapi dan kelihatan.</h1>
          <p>
            Ringkasan pemasukan, pengeluaran, saldo, dan bukti transaksi dibuat sederhana supaya semua orang bisa
            mengecek tanpa perlu tanya ulang.
          </p>
          <div className="heroActions">
            <Link className="button buttonPrimary" href={pageHref("/pembayaran", summary.semester.id)}>
              Cek pembayaran
            </Link>
            <Link className="button buttonSecondary" href={pageHref("/pengeluaran", summary.semester.id)}>
              Lihat pengeluaran
            </Link>
          </div>
        </div>

        <aside className="balanceCard" aria-label="Ringkasan saldo">
          <div className="cardTop">
            <div>
              <span>Semester</span>
              <strong>{summary.semester.name}</strong>
            </div>
            <SemesterSwitcher summaries={summaries} selectedSemesterId={summary.semester.id} />
          </div>

          <div className="balanceAmount">
            <span>Saldo saat ini</span>
            <strong>{formatRupiah(summary.balance)}</strong>
          </div>

          <div className="progressBlock">
            <div className="progressInfo">
              <span>Progress pembayaran</span>
              <strong>{summary.progress}%</strong>
            </div>
            <div className="progressBar" aria-label={`Progress pembayaran ${summary.progress}%`}>
              <span style={{ width: `${summary.progress}%` }} />
            </div>
          </div>

          <div className="panelMetrics">
            <MetricRow label="Pemasukan" value={formatRupiah(summary.income)} />
            <MetricRow label="Pengeluaran" value={formatRupiah(summary.expenseTotal)} />
          </div>
        </aside>
      </section>

      <DataNotice summary={summary} />

      <section className="statsGrid" aria-label="Ringkasan kas">
        <StatCard
          label="Pemasukan"
          value={formatRupiah(summary.income)}
          caption={`${summary.paidCount} dari ${summary.totalStudents} mahasiswa`}
          tone="income"
        />
        <StatCard
          label="Pengeluaran"
          value={formatRupiah(summary.expenseTotal)}
          caption={`${summary.expenses.length} transaksi tercatat`}
          tone="expense"
        />
        <StatCard
          label="Belum Bayar"
          value={`${summary.unpaidCount} orang`}
          caption={`Iuran per orang ${formatRupiah(summary.semester.cashAmount)}`}
          tone="warning"
        />
        <StatCard
          label="Bukti"
          value={`${proofCount} bukti`}
          caption="Pembayaran dan pengeluaran"
        />
      </section>

      <section className="splitGrid">
        <article className="surface">
          <SectionHeader
            eyebrow="Pembayaran"
            title="Aktivitas terbaru"
            description="Cuplikan pembayaran yang sudah masuk dari spreadsheet."
            action={<Link href={pageHref("/pembayaran", summary.semester.id)}>Lihat semua</Link>}
          />

          <div className="compactList">
            {recentPaidStudents.length > 0 ? (
              recentPaidStudents.map((student) => (
                <div className="listRow" key={student.nim}>
                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.nim}</span>
                  </div>
                  <span>{student.payment?.timestamp ? formatDate(student.payment.timestamp) : "Lunas"}</span>
                </div>
              ))
            ) : (
              <div className="tableEmpty">Belum ada pembayaran yang tercatat.</div>
            )}
          </div>
        </article>

        <article className="surface">
          <SectionHeader
            eyebrow="Pengeluaran"
            title="Transaksi terakhir"
            description="Ringkasan pengeluaran terbaru untuk semester ini."
            action={<Link href={pageHref("/pengeluaran", summary.semester.id)}>Lihat detail</Link>}
          />

          <div className="compactList">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense, index) => (
                <div className="listRow" key={`${expense.title}-${expense.date}-${index}`}>
                  <div>
                    <strong>{expense.title}</strong>
                    <span>
                      {formatDate(expense.date)}
                      {expense.category ? ` - ${expense.category}` : ""}
                    </span>
                  </div>
                  <strong>{formatRupiah(expense.amount)}</strong>
                </div>
              ))
            ) : (
              <div className="tableEmpty">Belum ada pengeluaran yang tercatat.</div>
            )}
          </div>
        </article>
      </section>

      <section className="surface">
        <SectionHeader
          eyebrow="Transparansi"
          title="Yang bisa dicek publik"
          description="Fokusnya bukan banyak fitur. Fokusnya data yang jelas, sumber yang terbuka, dan update yang gampang dipantau."
        />

        <div className="trustGrid">
          <MetricRow label="Sumber pembayaran" value="Google Sheet publik" />
          <MetricRow label="Sumber pengeluaran" value="Google Sheet publik" />
          <MetricRow label="Update terakhir" value={latestPayment ? formatDate(latestPayment) : "Belum ada"} />
        </div>
      </section>
    </>
  );
}
