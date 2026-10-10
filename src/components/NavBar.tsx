"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

interface NavBarProps {
  onToggleSidebar?: () => void;
}

export function NavBar({ onToggleSidebar }: NavBarProps = {}) {
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Home" },
    { href: "/tools", label: "All Tools" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  const isToolsSection = pathname?.startsWith('/tools');

  return (
    <header className="site-header border-b border-ink/[0.08] bg-bg/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="nav-in flex justify-between w-full">
          <nav className="nav-links flex items-center gap-[4px]">
            {isToolsSection && onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden flex flex-col justify-center items-center w-[34px] h-[32px] rounded-[8px] bg-ink/5 dark:bg-white/5 text-ink hover:bg-ink/10 dark:hover:bg-white/10 transition-colors mr-1 p-1"
                aria-label="Toggle Tools Sidebar"
                title="Toggle Tools Sidebar"
              >
                <span className="w-[16px] h-[2px] bg-ink rounded-full mb-[3px]"></span>
                <span className="w-[16px] h-[2px] bg-ink rounded-full mb-[3px]"></span>
                <span className="w-[16px] h-[2px] bg-ink rounded-full"></span>
              </button>
            )}
            {links.filter(l => l.href === "/tools").map((link) => {
              const isActive = pathname === link.href ||
                (link.href === "/tools" && pathname.startsWith("/tools"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-[12px] py-[7px] rounded-[8px] text-[13.5px] transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-ink/[0.06] dark:bg-white/[0.08] text-ink font-medium"
                      : "text-grey hover:text-ink hover:bg-ink/[0.04] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <nav className="nav-links flex items-center gap-[2px]">
            {links.filter(l => l.href !== "/tools").map((link) => {
              const isActive = pathname === link.href ||
                (link.href === "/tools" && pathname.startsWith("/tools"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-[12px] py-[7px] rounded-[8px] text-[13.5px] transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-ink/[0.06] dark:bg-white/[0.08] text-ink font-medium"
                      : "text-grey hover:text-ink hover:bg-ink/[0.04] dark:hover:bg-white/[0.05]"
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
  );
}
