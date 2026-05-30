"use client";

import { useMemo, useState } from "react";
import type { StudentPaymentStatus } from "@/lib/summary";

type SpinMode = "all" | "paid" | "unpaid";

const spinModeLabels: Record<SpinMode, string> = {
  all: "Semua mahasiswa",
  paid: "Yang lunas",
  unpaid: "Yang belum",
};

export default function RandomPicker({ students }: { students: StudentPaymentStatus[] }) {
  const [spinMode, setSpinMode] = useState<SpinMode>("all");
  const [winner, setWinner] = useState<StudentPaymentStatus | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const candidates = useMemo(
    () => students.filter((student) => spinMode === "all" || student.status === spinMode),
    [students, spinMode],
  );

  function handleSpin() {
    if (candidates.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    let count = 0;
    const interval = window.setInterval(() => {
      setWinner(candidates[Math.floor(Math.random() * candidates.length)]);
      count += 1;

      if (count > 18) {
        window.clearInterval(interval);
        setIsSpinning(false);
      }
    }, 80);
  }

  return (
    <div className="pickerBox">
      <div className={`pickerMark ${isSpinning ? "spinning" : ""}`}>IF25</div>
      <div className="pickerContent">
        <label className="fieldGroup">
          <span>Mode</span>
          <select value={spinMode} onChange={(event) => setSpinMode(event.target.value as SpinMode)}>
            {(Object.keys(spinModeLabels) as SpinMode[]).map((key) => (
              <option key={key} value={key}>{spinModeLabels[key]}</option>
            ))}
          </select>
        </label>

        <div>
          <span>Hasil</span>
          <strong>{winner ? winner.name : "Belum dipilih"}</strong>
          <p>
            {winner
              ? `${winner.nim} - ${winner.status === "paid" ? "lunas" : "belum bayar"}`
              : `${candidates.length} kandidat tersedia`}
          </p>
        </div>

        <button className="button buttonPrimary" onClick={handleSpin} disabled={candidates.length === 0 || isSpinning}>
          {isSpinning ? "Memilih..." : "Pilih acak"}
        </button>
      </div>
    </div>
  );
}
