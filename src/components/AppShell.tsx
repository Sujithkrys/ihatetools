"use client";

import React, { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";

function ShellInner({ children }: { children: ReactNode }) {
  const { sidebarOpen, closeSidebar, isMobile } = useSidebar();

  return (
    <div className="app-shell">
      <AppSidebar />

      {/* Backdrop rendered ONLY below 1024px when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-[2px] transition-opacity cursor-pointer"
          aria-label="Close sidebar backdrop"
        />
      )}

      <div className="app-main flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ShellInner>{children}</ShellInner>
    </SidebarProvider>
  );
}
