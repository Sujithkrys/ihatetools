"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TOOLS, ToolData } from "@/lib/tools-data";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery)
    );
    
    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) {
        setIsOpen(false);
        setQuery("");
        router.push(results[0].href);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={wrapperRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-textMuted" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md leading-5 bg-surface text-textPrimary placeholder-textMuted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-all"
        placeholder="Search tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length > 0) setIsOpen(true);
        }}
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-md shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((tool) => {
                const Icon = tool.icon;
                return (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-surfaceHover transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <Icon className="w-5 h-5 text-textMuted shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-textPrimary">{tool.name}</p>
                        <p className="text-xs text-textSecondary line-clamp-1">{tool.description}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-textSecondary">
              No tools found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
