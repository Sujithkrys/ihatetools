'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Ruler } from './Ruler';

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
    else setOpen(true); // Default open on desktop

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
    if (isMobile) {
      setOpen(false);
      localStorage.setItem(STORAGE_KEY, 'false');
    }
  }

  const sidebarOpen = mounted ? open : false;

  return (
    <div className="min-h-screen bg-bg dark:bg-black flex">
      <Sidebar open={sidebarOpen} onClose={close} currentPath={pathname} />
      {mounted && isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-ink/50 dark:bg-black/50 z-40" onClick={close} />
      )}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${!isMobile && sidebarOpen ? 'lg:ml-[280px]' : ''} flex flex-col`}>
        <div className="sticky top-0 z-40 bg-bg dark:bg-black">
          <Ruler />
        </div>
        <div className="lg:hidden p-4 flex items-center border-b border-ink/10 dark:border-white/10">
          <button onClick={toggle} className="text-grey dark:text-gray-400 hover:text-ink dark:hover:text-white">
            <Menu size={24} />
          </button>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export { AppShell };
