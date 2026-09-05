"use client";

import { useState } from "react";
import { CaseUpper, Copy, CheckCircle, Eraser } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

type CaseType = "lower" | "upper" | "title" | "camel" | "snake" | "kebab";

export function CaseConverterWidget() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const convertCase = (type: CaseType) => {
    if (!text.trim()) return;

    let result = text;
    switch (type) {
      case "lower":
        result = text.toLowerCase();
        break;
      case "upper":
        result = text.toUpperCase();
        break;
      case "title":
        result = text.toLowerCase().replace(/(?:^|\s|-|_)\w/g, (match) => match.toUpperCase());
        break;
      case "camel":
        // Lowercase the first word, TitleCase the rest, remove spaces/dashes/underscores
        result = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+|-|_/g, "");
        break;
      case "snake":
        result = text
          .replace(/\W+/g, " ")
          .trim()
          .split(/\s+/)
          .join("_")
          .toLowerCase();
        break;
      case "kebab":
        result = text
          .replace(/\W+/g, " ")
          .trim()
          .split(/\s+/)
          .join("-")
          .toLowerCase();
        break;
    }
    setText(result);
  };

  return (
    <ToolWidgetShell>
      <div className="bg-paper rounded-lg border border-ink/10 overflow-hidden flex flex-col shadow-hard">
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center px-4 py-3 border-b border-ink/10 bg-white/[0.02] gap-4">
          <div className="flex items-center gap-2 text-grey font-medium">
            <CaseUpper className="w-4 h-4 text-yellow" />
            <span className="text-sm">Text Editor</span>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => convertCase("lower")}
              disabled={!text}
              className="px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              lowercase
            </button>
            <button
              onClick={() => convertCase("upper")}
              disabled={!text}
              className="px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => convertCase("title")}
              disabled={!text}
              className="px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              Title Case
            </button>
            <button
              onClick={() => convertCase("camel")}
              disabled={!text}
              className="px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              camelCase
            </button>
            <button
              onClick={() => convertCase("snake")}
              disabled={!text}
              className="px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              snake_case
            </button>
            <button
              onClick={() => convertCase("kebab")}
              disabled={!text}
              className="px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              kebab-case
            </button>
            
            <div className="w-px h-6 bg-overlay/10 self-center mx-1 hidden sm:block"></div>
            
            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow/20 hover:bg-yellow/30 text-yellow rounded text-xs font-medium transition-colors disabled:opacity-50"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
            <button
              onClick={() => setText("")}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 rounded text-xs font-medium text-ink transition-colors disabled:opacity-50"
            >
              <Eraser className="w-3.5 h-3.5 text-error" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to convert..."
          className="w-full min-h-[300px] p-6 bg-transparent text-ink focus:outline-none resize-y text-base leading-relaxed"
          spellCheck={false}
        />
      </div>
    </ToolWidgetShell>
  );
}
