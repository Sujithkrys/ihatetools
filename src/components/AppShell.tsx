'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { NavBar } from './NavBar';

const STORAGE_KEY = 'ihatetools-sidebar-open';
const BREAKPOINT = 1024;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setOpen(stored === 'true');

    function checkWidth() {
      setIsMobile(window.innerWidth < BREAKPOINT);
    }
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  function close() {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  }

  const isToolsSection = pathname?.startsWith('/tools');
  // Always keep the sidebar open on desktop when in tools section
  const sidebarOpen = isToolsSection && (mounted ? (isMobile ? open : true) : true);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={close} currentPath={pathname} />
      {mounted && isMobile && sidebarOpen && (
        <div className="backdrop" onClick={close} />
      )}
      <div className="app-main">
        {/* Pass toggle if needed for mobile hamburger menu in the future, for now undefined */}
        <NavBar onLogoClick={isMobile ? toggle : undefined} />
        {children}
      </div>
    </div>
  );
}

export { AppShell };
