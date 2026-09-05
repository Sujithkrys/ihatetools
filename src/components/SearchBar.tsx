"use client";

import { useState, useEffect, useRef } from "react";
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
    <div className="hidden md:flex flex-1 max-w-[310px] relative" ref={wrapperRef}>
      <input
        type="text"
        className="block w-full border-[1.5px] border-ink rounded-[7px] px-[12px] py-[7px] text-[13px] bg-bg text-grey placeholder:text-grey focus:outline-none focus:ring-1 focus:ring-sel focus:border-sel transition-all"
        placeholder="Search tools…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length > 0) setIsOpen(true);
        }}
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-paper border-[1.5px] border-ink rounded-[7px] shadow-hard overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-bg transition-colors border-b border-ink/10 last:border-b-0"
                  >
                    {tool.beforeText && (
                      <span className="font-mono text-[9px] text-grey border-[1.5px] border-ink rounded-[4px] px-1.5 py-1 bg-bg shrink-0 mt-0.5">
                        {tool.beforeText}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink">{tool.name}</p>
                      <p className="text-xs text-grey line-clamp-1">{tool.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-grey">
              No tools found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
