"use client";

import { usePathname, useRouter } from "next/navigation";
import type { SemesterSummary } from "@/lib/summary";

export default function SemesterSwitcher({
  summaries,
  selectedSemesterId,
}: {
  summaries: SemesterSummary[];
  selectedSemesterId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(value: string) {
    router.push(`${pathname}?semester=${encodeURIComponent(value)}`);
  }

  return (
    <label className="fieldGroup">
      <span>Semester</span>
      <select value={selectedSemesterId} onChange={(event) => handleChange(event.target.value)}>
        {summaries.map((summary) => (
          <option key={summary.semester.id} value={summary.semester.id}>
            {summary.semester.name}
          </option>
        ))}
      </select>
    </label>
  );
}
