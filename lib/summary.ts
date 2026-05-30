import type { SemesterConfig } from "@/config/semesters";
import { students, type Student } from "@/data/students";
import type { ExpenseRecord, PaymentRecord, SemesterDataset } from "@/lib/sheets";

export type StudentPaymentStatus = Student & {
  status: "paid" | "unpaid";
  payment?: PaymentRecord;
};

export type SemesterSummary = {
  semester: SemesterConfig;
  students: StudentPaymentStatus[];
  expenses: ExpenseRecord[];
  totalStudents: number;
  paidCount: number;
  unpaidCount: number;
  income: number;
  expenseTotal: number;
  balance: number;
  progress: number;
  errors: string[];
};

function uniqueStudentsByNim(source: Student[]) {
  const uniqueStudents = new Map<string, Student>();

  for (const student of source) {
    if (!uniqueStudents.has(student.nim)) {
      uniqueStudents.set(student.nim, student);
    }
  }

  return Array.from(uniqueStudents.values());
}

export function buildSemesterSummary(semester: SemesterConfig, dataset: SemesterDataset): SemesterSummary {
  const paymentByNim = new Map<string, PaymentRecord>();
  for (const payment of dataset.payments) {
    if (!paymentByNim.has(payment.nim)) paymentByNim.set(payment.nim, payment);
  }

  const masterStudents = uniqueStudentsByNim(students);
  const statuses = masterStudents.map((student) => {
    const payment = paymentByNim.get(student.nim);
    return {
      ...student,
      status: payment ? "paid" : "unpaid",
      payment,
    } satisfies StudentPaymentStatus;
  });

  const paidCount = statuses.filter((student) => student.status === "paid").length;
  const expenseTotal = dataset.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const income = paidCount * semester.cashAmount;

  return {
    semester,
    students: statuses,
    expenses: dataset.expenses,
    totalStudents: masterStudents.length,
    paidCount,
    unpaidCount: masterStudents.length - paidCount,
    income,
    expenseTotal,
    balance: income - expenseTotal,
    progress: students.length === 0 ? 0 : Math.round((paidCount / students.length) * 100),
    errors: dataset.errors,
  };
}
