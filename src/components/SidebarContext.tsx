"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const STORAGE_KEY = "ihatetools-sidebar-open";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Read saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setSidebarOpen(saved === "true");
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  // Listen to breakpoint (<= 1024px)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
        try {
          localStorage.setItem(STORAGE_KEY, "false");
        } catch {}
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "false");
    } catch {}
  };

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        closeSidebar,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
