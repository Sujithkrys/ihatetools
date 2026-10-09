'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  X, Search, LayoutDashboard, Clock, Star, 
  ChevronRight, ChevronDown, Download, Heart, Coffee, Layers
} from 'lucide-react';
import { TOOLS } from '@/lib/tools-data';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

export default function Sidebar({ open, onClose, currentPath }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Page Management': true,
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const categories = [
    { title: "Page Management", filters: ["PDF Tools"] },
    { title: "Image Editing", filters: ["Image Tools"] },
    { title: "Edit & Annotate", filters: ["Text Tools"] },
    { title: "Audio & Utility", filters: ["Audio Tools", "Utility Tools"] }
  ];

  const toggleCat = (cat: string) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#000000] text-gray-400 border-r border-white/10 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold text-[15px]">
          <Layers size={18} />
          ihatepdf.cv
        </Link>
        <button className="lg:hidden text-gray-400 hover:text-white" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 bg-white/5 rounded-md px-3 py-2 border border-white/5">
          <Search size={15} className="text-gray-500" />
          <input type="text" placeholder="Search Tools" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-600" />
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-500 whitespace-nowrap">Ctrl K</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <div className="space-y-0.5">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] ${currentPath === '/' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] hover:bg-white/5 hover:text-white">
            <Clock size={16} />
            Recent files
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] hover:bg-white/5 hover:text-white">
            <Star size={16} />
            Starred
          </Link>
        </div>

        <div>
          <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-2">Tools</div>
          {categories.map((cat) => {
            const catTools = TOOLS.filter(t => cat.filters.includes(t.category));
            if (catTools.length === 0) return null;
            const isExpanded = expanded[cat.title];

            return (
              <div key={cat.title} className="mb-1">
                <button 
                  onClick={() => toggleCat(cat.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[13.5px] hover:bg-white/5 hover:text-white rounded-md transition-colors"
                >
                  <span className="truncate">{cat.title}</span>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span className="text-[11px]">{catTools.length}</span>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="mt-1 pl-4 space-y-0.5">
                    {catTools.map(tool => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] ${currentPath === tool.href ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <tool.icon size={14} />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-white/5 space-y-1">
        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] hover:bg-white/5 hover:text-white">
          <Download size={15} />
          Install app
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] hover:bg-white/5 hover:text-white">
          <Heart size={15} />
          Sponsor a slot
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-red-400 hover:bg-white/5 hover:text-red-300">
          <Coffee size={15} />
          Donate
        </Link>
      </div>
    </aside>
  );
}
