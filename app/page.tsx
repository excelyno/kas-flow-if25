import Dashboard from "@/components/Dashboard";
import { EmptyState } from "@/components/FinanceUi";
import { getSelectedSemesterSummary, type SemesterSearchParams } from "@/lib/dashboard-data";

export default async function Home({ searchParams }: { searchParams?: SemesterSearchParams }) {
  const { summaries, summary } = await getSelectedSemesterSummary(searchParams);

  if (!summary) {
    return <EmptyState title="Belum ada konfigurasi semester." description="Tambahkan semester di config/semesters.ts." />;
  }

  return <Dashboard summaries={summaries} summary={summary} />;
}
