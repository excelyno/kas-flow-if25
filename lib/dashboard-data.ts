import { activeSemesterId, semesters } from "@/config/semesters";
import { getSemesterDataset } from "@/lib/sheets";
import { buildSemesterSummary, type SemesterSummary } from "@/lib/summary";

export type SemesterSearchParams = {
  semester?: string | string[];
};

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function getSemesterSummaries() {
  return Promise.all(
    semesters.map(async (semester) => buildSemesterSummary(semester, await getSemesterDataset(semester))),
  );
}

export function resolveSemesterId(searchParams?: SemesterSearchParams) {
  const requestedSemesterId = firstParam(searchParams?.semester);
  const requestedSemester = semesters.find((semester) => semester.id === requestedSemesterId);

  return requestedSemester?.id ?? activeSemesterId ?? semesters[0]?.id ?? "";
}

export function findSemesterSummary(summaries: SemesterSummary[], semesterId: string) {
  return summaries.find((summary) => summary.semester.id === semesterId) ?? summaries[0];
}

export async function getSelectedSemesterSummary(searchParams?: SemesterSearchParams) {
  const summaries = await getSemesterSummaries();
  const semesterId = resolveSemesterId(searchParams);
  const summary = findSemesterSummary(summaries, semesterId);

  return {
    summaries,
    summary,
    semesterId: summary?.semester.id ?? semesterId,
  };
}

export function countProofs(summary: SemesterSummary) {
  const paymentProofs = summary.students.filter((student) => Boolean(student.payment?.proofUrl)).length;
  const expenseProofs = summary.expenses.filter((expense) => Boolean(expense.proofUrl)).length;

  return paymentProofs + expenseProofs;
}

export function getLatestPaymentTimestamp(summary: SemesterSummary) {
  return summary.students.find((student) => student.payment?.timestamp)?.payment?.timestamp;
}
