"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import { LIMITS } from "@/lib/ratelimit";

export function SummarizerWidget() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const charCount = text.length;
  const isOverLimit = charCount > LIMITS.MAX_INPUT_CHARS;

  async function handleSummarize() {
    if (!text.trim() || isOverLimit || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate summary. Please try again.");
        if (typeof data.remaining === "number") {
          setRemaining(data.remaining);
        }
        return;
      }

      setSummary(data.summary);
      if (typeof data.remaining === "number") {
        setRemaining(data.remaining);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClear() {
    setText("");
    setSummary("");
    setError(null);
  }

  return (
    <div className="w-full bg-paper dark:bg-bg border border-ink/8 dark:border-white/10 rounded-[18px] p-5 sm:p-7 shadow-soft dark:shadow-soft-dark">
      {/* Top Controls & Allowance indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-ink/6 dark:border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-grey">
            Characters:{" "}
            <span
              className={`font-mono font-semibold ${
                isOverLimit ? "text-pink" : "text-ink dark:text-white"
              }`}
            >
              {charCount.toLocaleString()} / {LIMITS.MAX_INPUT_CHARS.toLocaleString()}
            </span>
          </span>
        </div>

        {remaining !== null && (
          <div className="text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-2.5 py-1 rounded-full">
            {remaining > 0 ? (
              <span>
                <strong className="text-ink dark:text-white">{remaining}</strong> summaries left today
              </span>
            ) : (
              <span className="text-pink font-semibold">Daily limit reached</span>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="space-y-4">
        <div>
          <label htmlFor="input-text" className="sr-only">
            Text to summarize
          </label>
          <textarea
            id="input-text"
            rows={7}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste or type article, document, or meeting notes here (up to 3,000 characters)..."
            className="w-full p-4 rounded-[12px] border border-ink/10 dark:border-white/10 bg-bg/50 dark:bg-black/30 text-ink dark:text-white placeholder:text-grey/60 text-[14.5px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-sel/30 focus:border-sel transition-all resize-y font-sans"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-[10px] bg-pink/10 border border-pink/20 text-pink text-[13.5px]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClear}
            disabled={!text && !summary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-grey hover:text-ink dark:hover:text-white disabled:opacity-40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>

          <button
            type="button"
            onClick={handleSummarize}
            disabled={!text.trim() || isOverLimit || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-ink dark:bg-white text-paper dark:text-ink font-medium text-[14px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-yellow" />
            {loading ? "Summarizing..." : "Summarize with AI"}
          </button>
        </div>
      </div>

      {/* Output / Result area */}
      {summary && (
        <div className="mt-7 pt-6 border-t border-ink/8 dark:border-white/10 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-ink dark:text-white uppercase tracking-wider">
              Summary
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-grey hover:text-ink dark:hover:text-white px-2.5 py-1 rounded-md bg-ink/5 dark:bg-white/5 hover:bg-ink/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green" />
                  <span className="text-green">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-[12px] bg-bg/80 dark:bg-black/40 border border-ink/6 dark:border-white/8 text-[14.5px] leading-[1.65] text-ink dark:text-gray-100 whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
