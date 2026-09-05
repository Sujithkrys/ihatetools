"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { Ruler } from "./Ruler";

export function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "All Tools" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <Ruler />
      <header className="border-b-[1.5px] border-ink bg-paper sticky top-0 z-50">
        <div className="max-w-content mx-auto px-4 md:px-[34px] h-[58px] flex items-center gap-[22px]">
          <Link href="/" className="font-logo text-[20px] font-extrabold tracking-[-0.03em] text-ink shrink-0">
            ihatetools
          </Link>

          <SearchBar />

          <nav className="ml-auto flex items-center gap-[3px]">
            {links.map((link) => {
              const isActive = pathname === link.href || 
                (link.href === "/tools" && pathname.startsWith("/tools"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-[10.5px] uppercase tracking-[0.04em] px-[11px] py-[6px] border-[1.5px] rounded-[5px] transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-cyan border-ink text-ink"
                      : "border-transparent text-ink hover:border-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
