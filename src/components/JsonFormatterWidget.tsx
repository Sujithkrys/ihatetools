"use client";

import { useState } from "react";
import { Braces, Copy, CheckCircle, Eraser, AlertTriangle, FileJson } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { cn } from "@/lib/utils";

export function JsonFormatterWidget() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFormat = () => {
    setErrorMsg("");
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setInput(formatted);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(`Invalid JSON: ${err.message}`);
      } else {
        setErrorMsg("Invalid JSON syntax.");
      }
    }
  };

  const handleMinify = () => {
    setErrorMsg("");
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(`Invalid JSON: ${err.message}`);
      } else {
        setErrorMsg("Invalid JSON syntax.");
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleClear = () => {
    setInput("");
    setErrorMsg("");
  };

  return (
    <ToolWidgetShell>
      <div className="bg-surface rounded-lg border border-white/5 overflow-hidden flex flex-col shadow-lg">
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 border-b border-white/5 bg-white/[0.02] gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2 text-textSecondary font-medium">
              <Braces className="w-4 h-4 text-accent" />
              <span className="text-sm">JSON Editor</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-textSecondary">Indent:</span>
              <select 
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="bg-background border border-white/10 rounded px-2 py-1 text-xs text-textPrimary focus:outline-none focus:border-accent"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value={8}>8 Spaces</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 self-end sm:self-auto flex-wrap justify-end">
            <button
              onClick={handleMinify}
              disabled={!input}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium text-textPrimary transition-colors disabled:opacity-50"
            >
              Minify
            </button>
            <button
              onClick={handleFormat}
              disabled={!input}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent rounded text-xs font-medium transition-colors disabled:opacity-50"
            >
              <FileJson className="w-3.5 h-3.5" />
              Format
            </button>
            <div className="w-px h-6 bg-white/10 self-center mx-1"></div>
            <button
              onClick={handleCopy}
              disabled={!input}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium text-textPrimary transition-colors disabled:opacity-50"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
            <button
              onClick={handleClear}
              disabled={!input}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium text-textPrimary transition-colors disabled:opacity-50"
            >
              <Eraser className="w-3.5 h-3.5 text-error" />
              Clear
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setErrorMsg(""); }}
            placeholder='Paste your JSON here...&#10;&#10;{&#10;  "hello": "world"&#10;}'
            className={cn(
              "w-full min-h-[400px] p-4 sm:p-6 bg-transparent text-textPrimary focus:outline-none resize-y font-mono text-sm leading-relaxed whitespace-pre",
              errorMsg ? "border-error/30 bg-error/5" : ""
            )}
            spellCheck={false}
          />
          {errorMsg && (
            <div className="absolute bottom-4 left-4 right-4 bg-error/10 border border-error/50 rounded-md p-3 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <p className="text-sm text-error font-mono break-words">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>
    </ToolWidgetShell>
  );
}
