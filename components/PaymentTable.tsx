"use client";

import { useMemo, useState } from "react";
import { PaymentBadge } from "@/components/FinanceUi";
import { formatDate } from "@/lib/currency";
import type { StudentPaymentStatus } from "@/lib/summary";

type Filter = "all" | "paid" | "unpaid";

const filterLabels: Record<Filter, string> = {
  all: "Semua",
  paid: "Lunas",
  unpaid: "Belum",
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export default function PaymentTable({ students }: { students: StudentPaymentStatus[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredStudents = useMemo(() => {
    const keyword = normalize(query);

    return students.filter((student) => {
      const matchesQuery = !keyword || normalize(`${student.name} ${student.nim}`).includes(keyword);
      const matchesFilter = filter === "all" || student.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [students, query, filter]);

  return (
    <div className="dataPanel">
      <div className="toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama atau NIM"
          aria-label="Cari nama atau NIM"
        />
        <div className="segmentedControl" aria-label="Filter pembayaran">
          {(Object.keys(filterLabels) as Filter[]).map((key) => (
            <button key={key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>
              {filterLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Nama</th>
              <th>NIM</th>
              <th>Tanggal</th>
              <th>Bukti</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.nim}>
                <td><PaymentBadge status={student.status} /></td>
                <td><strong className="studentName">{student.name}</strong></td>
                <td>{student.nim}</td>
                <td>{student.payment?.timestamp ? formatDate(student.payment.timestamp) : "-"}</td>
                <td>
                  {student.payment?.proofUrl ? (
                    <a href={student.payment.proofUrl} target="_blank" rel="noreferrer">Lihat bukti</a>
                  ) : (
                    <span className="muted">Belum ada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="tableEmpty">Tidak ada mahasiswa yang cocok dengan filter ini.</div>
      ) : null}
    </div>
  );
}
