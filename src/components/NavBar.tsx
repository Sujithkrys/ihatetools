"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Ruler } from "./Ruler";
import { Logo } from "./Logo";

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
    <header className="site-header border-b border-ink/[0.08] bg-bg sticky top-0 z-40">
      {!isToolsSection && <Ruler />}
      <div className="nav-in flex justify-between w-full">
          <div className="flex items-center gap-4">
          <Logo size={22} className="text-ink" />
          <nav className="nav-links flex items-center gap-[6px]">
            {isToolsSection && onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden flex flex-col justify-center items-center w-[34px] h-[32px] rounded-[5px] border-[1.5px] border-ink bg-paper text-ink hover:bg-cyan transition-colors mr-1 p-1"
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
                  className={`px-[11px] py-[6px] rounded-[5px] text-[13.5px] transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-cyan border-[1.5px] border-ink text-[#111212] font-medium"
                      : "border-transparent text-ink hover:border-ink border-[1.5px]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          </div>

          <nav className="nav-links flex items-center gap-[4px]">
            {links.filter(l => l.href !== "/tools").map((link) => {
              const isActive = pathname === link.href || 
                (link.href === "/tools" && pathname.startsWith("/tools"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-[11px] py-[6px] rounded-[5px] text-[13.5px] transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-cyan border-[1.5px] border-ink text-[#111212] font-medium"
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
  );
}
