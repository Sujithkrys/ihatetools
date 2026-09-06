'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { NavBar } from './NavBar';
import { HeadingStyleProvider } from './HeadingStyleContext';

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

  // Render closed until mounted to avoid SSR/localStorage mismatch flash
  const sidebarOpen = mounted ? open : false;

  return (
    <HeadingStyleProvider>
      <div className="app-shell">
        <Sidebar open={sidebarOpen} onClose={close} currentPath={pathname} />
        {mounted && isMobile && sidebarOpen && (
          <div className="backdrop" onClick={close} />
        )}
        <div className="app-main">
          {/* Your existing NavBar goes here — pass toggle as the logo's onClick */}
          <NavBar onLogoClick={toggle} />
          {children}
        </div>
      </div>
    </HeadingStyleProvider>
  );
}

export { AppShell };
