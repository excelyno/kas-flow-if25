import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alur Kas IF25",
  description: "Transparansi pemasukan dan pengeluaran kas IF25.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
