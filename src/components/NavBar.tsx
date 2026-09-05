"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { Ruler } from "./Ruler";
import { useSidebar } from "./SidebarContext";

export function NavBar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const links = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "All Tools" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <Ruler />
      <header className="site-header border-b border-ink/[0.08] bg-paper sticky top-0 z-40">
        <div className="nav-in w-full px-[24px] h-[58px] flex items-center gap-[22px]">
          <button
            type="button"
            onClick={toggleSidebar}
            className="logo text-ink shrink-0 cursor-pointer text-left hover:opacity-85 transition-opacity"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            ihatetools
          </button>

          <SearchBar />

          <nav className="nav-links ml-auto flex items-center gap-[4px]">
            {links.map((link) => {
              const isActive = pathname === link.href || 
                (link.href === "/tools" && pathname.startsWith("/tools"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-[11px] py-[6px] rounded-[5px] text-[13.5px] transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-cyan border-[1.5px] border-ink text-ink font-medium"
                      : "border-transparent text-ink hover:border-ink border-[1.5px]"
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
