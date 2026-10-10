'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools-data';
import { Logo } from './Logo';

const CATEGORY_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pdf:   { label: 'PDF Tools',   bg: 'rgba(245, 194, 66, 0.16)', color: '#F5C242' },
  image: { label: 'Image Tools', bg: 'rgba(91, 200, 232, 0.16)', color: '#5BC8E8' },
  audio: { label: 'Audio Tools', bg: 'rgba(255, 138, 101, 0.16)', color: '#FF8A65' },
  util:  { label: 'Utility',     bg: 'rgba(45, 212, 172, 0.16)', color: '#2DD4AC' },
  text:  { label: 'Text & Dev',  bg: 'rgba(155, 138, 230, 0.16)', color: '#9B8AE6' },
};

const CATEGORY_MAP: Record<string, string> = {
  pdf: 'PDF Tools',
  image: 'Image Tools',
  audio: 'Audio Tools',
  util: 'Utility Tools',
  text: 'Text Tools',
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

export default function Sidebar({ open, onClose, currentPath }: SidebarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (query) {
          setQuery("");
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, query]);

  const categories = Object.keys(CATEGORY_STYLES);
  
  const lowerQuery = query.toLowerCase();
  const searchResults = query.trim().length > 0 
    ? TOOLS.filter(
        (tool) =>
          tool.name.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery)
      )
    : [];

  return (
    <aside className="app-sidebar" data-open={open}>
      <div className="sb-head flex items-center justify-between">
        <Logo size={20} className="text-[#F3F1ED]" cutoutColor="#111212" textClassName="sb-logo" />
        <button
          type="button"
          onClick={onClose}
          className="sb-close lg:hidden"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="px-[14px] pt-[14px]">
        <input
          type="text"
          className="block w-full border border-white/10 rounded-[9px] px-[12px] py-[8px] text-[13px] bg-white/5 text-[#F3F1ED] placeholder:text-grey focus:outline-none focus:ring-1 focus:ring-white/25 focus:border-white/25 transition-all"
          placeholder="Search tools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="sb-list">
        {query.trim().length > 0 ? (
          <div className="pt-2">
            <span className="sb-cat" style={{ background: '#333', color: '#FFF' }}>
              Search Results
            </span>
            {searchResults.length > 0 ? (
              searchResults.map((tool) => {
                const Icon = tool.icon;
                const isActive = currentPath === tool.href;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => {
                      setQuery("");
                      onClose();
                    }}
                    className={`sb-item${isActive ? ' active' : ''}`}
                  >
                    <span className="sb-icon">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                    {tool.name}
                  </Link>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-[13px] text-grey">
                No tools found matching &quot;{query}&quot;
              </div>
            )}
          </div>
        ) : (
          categories.map((cat) => {
            const style = CATEGORY_STYLES[cat];
            const tools = TOOLS.filter((t) => t.category === CATEGORY_MAP[cat] || t.category === cat);
            if (tools.length === 0) return null;
            return (
              <div key={cat}>
                <span className="sb-cat" style={{ background: style.bg, color: style.color }}>
                  {style.label}
                </span>
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = currentPath === tool.href;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={onClose}
                      className={`sb-item${isActive ? ' active' : ''}`}
                    >
                      <span className="sb-icon">
                        <Icon size={16} strokeWidth={1.6} />
                      </span>
                      {tool.name}
                    </Link>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
