"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { TOOLS, ToolCategory } from "@/lib/tools-data";
import { useSidebar } from "./SidebarContext";

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar, isMobile } = useSidebar();

  const categories: { key: ToolCategory; label: string; tag: string; tagColor: string }[] = [
    { 
      key: "PDF Tools", 
      label: "PDF Tools", 
      tag: "PDF", 
      tagColor: "bg-yellow text-ink border-ink" 
    },
    { 
      key: "Image Tools", 
      label: "Image Tools", 
      tag: "Image", 
      tagColor: "bg-cyan text-ink border-ink" 
    },
    { 
      key: "Text Tools", 
      label: "Text & Dev", 
      tag: "Text", 
      tagColor: "bg-violet text-ink border-ink" 
    },
  ];

  return (
    <aside 
      className="app-sidebar select-none" 
      data-open={sidebarOpen}
      aria-label="Site sidebar navigation"
    >
      <div className="w-[272px] h-full flex flex-col border-r border-white/10 text-[#E6E4DD]">
        {/* Sidebar Header */}
        <div className="h-[58px] px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-[15px] text-white tracking-[-0.02em]">
              Tools
            </span>
            <span className="font-mono text-[9px] text-[#A19E98] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              {TOOLS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-1.5 text-[#A19E98] hover:text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Tool Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 overscroll-contain">
          {categories.map(({ key, label, tag, tagColor }) => {
            const toolsInCat = TOOLS.filter((t) => t.category === key);

            return (
              <div key={key}>
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-2 px-2">
                  <span className={`tag font-mono text-[9px] uppercase tracking-[0.08em] px-[7px] py-[2px] border-[1.5px] rounded-[3px] font-semibold ${tagColor}`}>
                    {tag}
                  </span>
                  <span className="font-sans text-[12px] font-medium text-[#A19E98]">
                    {label}
                  </span>
                </div>

                {/* Tools List */}
                <div className="space-y-0.5">
                  {toolsInCat.map((tool) => {
                    const isActive = pathname === tool.href;

                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        onClick={() => {
                          if (isMobile) {
                            closeSidebar();
                          }
                        }}
                        className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors ${
                          isActive
                            ? "bg-white/15 text-white font-medium border-l-2 border-sel"
                            : "text-[#A19E98] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span
                          className={`w-[22px] h-[22px] rounded flex items-center justify-center font-mono text-[8px] font-medium shrink-0 border ${
                            isActive
                              ? "border-white/30 text-white bg-white/10"
                              : "border-white/10 text-[#A19E98] bg-white/[0.03] group-hover:border-white/20 group-hover:text-white"
                          }`}
                        >
                          {tool.beforeText ? tool.beforeText.slice(0, 3) : "•"}
                        </span>
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
