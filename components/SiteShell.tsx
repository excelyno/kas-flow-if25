"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/pembayaran", label: "Pembayaran" },
  { href: "/pengeluaran", label: "Pengeluaran" },
  { href: "/audit", label: "Audit" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="appFrame">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Alur Kas IF25">
          <span className="brandMark">AK</span>
          <span>
            <strong>Alur Kas IF25</strong>
            <small>Kas yang bisa dicek</small>
          </span>
        </Link>

        <nav className="navLinks" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={isActive(pathname, item.href) ? "active" : ""}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="pageShell">{children}</main>

      <footer className="footer">
        <strong>Alur Kas IF25</strong>
        <span>Transparansi kas yang rapi, singkat, dan bisa dipertanggungjawabkan.</span>
      </footer>
    </div>
  );
}
