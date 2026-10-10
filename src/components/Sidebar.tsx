'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools-data';

const CATEGORY_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pdf:   { label: 'PDF Tools',   bg: '#F5C242', color: '#2A2200' },
  image: { label: 'Image Tools', bg: '#5BC8E8', color: '#00232B' },
  audio: { label: 'Audio Tools', bg: '#FF8A65', color: '#3E1500' },
  util:  { label: 'Utility',     bg: '#2DD4AC', color: '#002B21' },
  text:  { label: 'Text & Dev',  bg: '#9B8AE6', color: '#1E1240' },
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
        <Link href="/" className="sb-logo no-underline">ihatetools</Link>
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
          className="block w-full border-[1.5px] border-ink rounded-[7px] px-[12px] py-[7px] text-[13px] bg-bg text-grey placeholder:text-grey focus:outline-none focus:ring-1 focus:ring-sel focus:border-sel transition-all"
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
