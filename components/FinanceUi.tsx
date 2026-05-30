import type { SemesterSummary } from "@/lib/summary";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="pageHeader">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="pageHeaderAction">{action}</div> : null}
    </header>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="sectionHeader">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="sectionAction">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  caption,
  tone = "neutral",
}: {
  label: string;
  value: string;
  caption: string;
  tone?: "neutral" | "income" | "expense" | "warning";
}) {
  return (
    <article className={`statCard tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{caption}</p>
    </article>
  );
}

export function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="metricRow">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function PaymentBadge({ status }: { status: "paid" | "unpaid" }) {
  return (
    <span className={`badge ${status === "paid" ? "badgeSuccess" : "badgeDanger"}`}>
      {status === "paid" ? "Lunas" : "Belum"}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="emptyState">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function DataNotice({ summary }: { summary: SemesterSummary }) {
  if (summary.errors.length === 0) return null;

  return (
    <section className="notice" role="status">
      <strong>Catatan data</strong>
      {summary.errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </section>
  );
}
