"use client";

import { useState } from "react";
import { SplitSquareHorizontal, Diff } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import * as diff from "diff";
import { cn } from "@/lib/utils";

export function TextDiffCheckerWidget() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<diff.Change[]>([]);
  const [hasCompared, setHasCompared] = useState(false);

  const handleCompare = () => {
    // We use diffLines for text diffing
    const differences = diff.diffLines(text1, text2);
    setDiffResult(differences);
    setHasCompared(true);
  };

  const handleClear = () => {
    setText1("");
    setText2("");
    setDiffResult([]);
    setHasCompared(false);
  };

  return (
    <ToolWidgetShell>
      <div className="bg-surface rounded-lg border border-white/5 overflow-hidden flex flex-col shadow-lg">
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center px-4 py-4 border-b border-white/5 bg-white/[0.02] gap-4">
          <div className="flex items-center gap-2 text-textSecondary font-medium">
            <SplitSquareHorizontal className="w-4 h-4 text-accent" />
            <span className="text-sm">Diff Checker</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-textPrimary rounded font-medium text-sm transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleCompare}
              disabled={!text1 && !text2}
              className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent/90 text-background rounded font-medium text-sm transition-colors disabled:opacity-50"
            >
              <Diff className="w-4 h-4" />
              Compare
            </button>
          </div>
        </div>

        {!hasCompared ? (
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="flex-1 flex flex-col">
              <div className="px-4 py-2 bg-black/10 border-b border-white/5 text-xs font-medium text-textSecondary uppercase tracking-wider">
                Original Text
              </div>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full min-h-[400px] p-4 bg-transparent text-textPrimary focus:outline-none resize-y font-mono text-sm leading-relaxed"
                spellCheck={false}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="px-4 py-2 bg-black/10 border-b border-white/5 text-xs font-medium text-textSecondary uppercase tracking-wider">
                Changed Text
              </div>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Paste changed text here..."
                className="w-full min-h-[400px] p-4 bg-transparent text-textPrimary focus:outline-none resize-y font-mono text-sm leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between px-4 py-2 bg-black/10 border-b border-white/5">
              <span className="text-xs font-medium text-textSecondary uppercase tracking-wider">
                Diff Result (Inline)
              </span>
              <button 
                onClick={() => setHasCompared(false)}
                className="text-xs text-accent hover:underline"
              >
                Edit Texts
              </button>
            </div>
            <div className="p-4 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {diffResult.map((part, index) => {
                return (
                  <span
                    key={index}
                    className={cn(
                      part.added && "bg-success/20 text-success line-through decoration-transparent",
                      part.removed && "bg-error/20 text-error line-through",
                      !part.added && !part.removed && "text-textSecondary"
                    )}
                  >
                    {part.value}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolWidgetShell>
  );
}
