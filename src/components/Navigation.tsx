"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Sparkles, Search } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/tv-shows", icon: Tv },
  { name: "Anime", href: "/anime", icon: Sparkles },
  { name: "Search", href: "/search", icon: Search },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sticky Header */}
      <header className="mobile-header">
        <Link href="/" className="mobile-logo">
          ViewVerse
        </Link>
        <Link href="/search">
          <Search size={22} className="text-secondary" />
        </Link>
      </header>

      {/* Desktop Glass Sidebar */}
      <aside className="sidebar-desktop">
        <Link href="/" className="sidebar-logo">
          <Film size={28} className="text-accent-cyan" style={{ color: "#00f2fe" }} />
          <span>ViewVerse</span>
        </Link>
        <nav style={{ flex: 1 }}>
          <ul className="sidebar-menu">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li
                  key={item.href}
                  className={`sidebar-item ${active ? "active" : ""}`}
                >
                  <Link href={item.href}>
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
          © 2026 ViewVerse
        </div>
      </aside>

      {/* Mobile Sticky Bottom Nav */}
      <nav className="mobile-nav">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${active ? "active" : ""}`}
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
