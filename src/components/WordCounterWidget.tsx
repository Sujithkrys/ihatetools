"use client";

import { useState, useMemo } from "react";
import { FileText, Copy, CheckCircle, Eraser } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function WordCounterWidget() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    
    // Split by whitespace and filter out empty strings
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    
    // Split by one or more newlines to count paragraphs
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;
    
    // Average reading speed is roughly 200 words per minute
    const readingTimeMins = words / 200;
    const readMinutes = Math.floor(readingTimeMins);
    const readSeconds = Math.round((readingTimeMins - readMinutes) * 60);
    
    let readingTime = "";
    if (words === 0) readingTime = "0 min";
    else if (readMinutes === 0) readingTime = `${readSeconds} sec`;
    else readingTime = `${readMinutes} min ${readSeconds} sec`;

    return {
      chars,
      charsNoSpaces,
      words,
      paragraphs,
      readingTime
    };
  }, [text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <ToolWidgetShell>
      <div className="bg-paper rounded-lg border border-ink/10 overflow-hidden flex flex-col shadow-hard">
        {/* Top toolbar */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-ink/10 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-grey font-medium">
            <FileText className="w-4 h-4 text-yellow" />
            <span className="text-sm">Text Editor</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              <Eraser className="w-3.5 h-3.5 text-error" />
              Clear
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to begin counting..."
          className="w-full min-h-[300px] p-6 bg-transparent text-ink focus:outline-none resize-y text-base leading-relaxed"
          spellCheck={false}
        />

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-white/5 border-t border-ink/10 bg-white/[0.01]">
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-ink">{stats.words}</span>
            <span className="text-xs text-grey uppercase tracking-wider font-semibold mt-1">Words</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-ink">{stats.chars}</span>
            <span className="text-xs text-grey uppercase tracking-wider font-semibold mt-1">Characters</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-ink">{stats.charsNoSpaces}</span>
            <span className="text-xs text-grey uppercase tracking-wider font-semibold mt-1 text-center">Without Spaces</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-ink">{stats.paragraphs}</span>
            <span className="text-xs text-grey uppercase tracking-wider font-semibold mt-1">Paragraphs</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center col-span-2 md:col-span-1 bg-yellow/5">
            <span className="text-xl font-bold text-yellow">{stats.readingTime}</span>
            <span className="text-xs text-grey uppercase tracking-wider font-semibold mt-1">Reading Time</span>
          </div>
        </div>
      </div>
    </ToolWidgetShell>
  );
}
