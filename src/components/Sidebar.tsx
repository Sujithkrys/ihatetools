'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { TOOLS } from '@/lib/tools-data';

const CATEGORY_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  pdf:   { label: 'PDF Tools',   bg: '#F5C242', color: '#2A2200' },
  image: { label: 'Image Tools', bg: '#5BC8E8', color: '#00232B' },
  text:  { label: 'Text & Dev',  bg: '#9B8AE6', color: '#1E1240' },
};

const CATEGORY_MAP: Record<string, string> = {
  pdf: 'PDF Tools',
  image: 'Image Tools',
  text: 'Text Tools',
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

export default function Sidebar({ open, onClose, currentPath }: SidebarProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const categories = Object.keys(CATEGORY_STYLES);

  return (
    <aside className="app-sidebar" data-open={open}>
      <div className="sb-head">
        <span className="sb-logo">ihatetools</span>
        <button className="sb-close" onClick={onClose} aria-label="Close sidebar">
          <X size={14} />
        </button>
      </div>
      <div className="sb-list">
        {categories.map((cat) => {
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
        })}
      </div>
    </aside>
  );
}
