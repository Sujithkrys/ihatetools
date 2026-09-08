"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  Fingerprint,
  Sliders,
} from "lucide-react";

export function UuidGeneratorWidget() {
  const [quantity, setQuantity] = useState(5);
  const [useHyphens, setUseHyphens] = useState(true);
  const [useUppercase, setUseUppercase] = useState(false);
  const [useBraces, setUseBraces] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"plain" | "json">("plain");

  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUuidV4 = useCallback((): string => {
    // Generate RFC4122 v4 UUID
    let uuid = "";
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      uuid = crypto.randomUUID();
    } else {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122

      const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    if (!useHyphens) {
      uuid = uuid.replace(/-/g, "");
    }
    if (useUppercase) {
      uuid = uuid.toUpperCase();
    } else {
      uuid = uuid.toLowerCase();
    }
    if (useBraces) {
      uuid = `{${uuid}}`;
    }
    return uuid;
  }, [useHyphens, useUppercase, useBraces]);

  const generateBatch = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      list.push(generateUuidV4());
    }
    setUuids(list);
  }, [quantity, generateUuidV4]);

  useEffect(() => {
    generateBatch();
  }, [generateBatch]);

  const formattedOutput =
    outputFormat === "json" ? JSON.stringify(uuids, null, 2) : uuids.join("\n");

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopySingle = async (val: string, index: number) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([formattedOutput], {
      type: outputFormat === "json" ? "application/json" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids_${Date.now()}.${outputFormat === "json" ? "json" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Controls Card */}
      <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-sm text-[var(--ink)]">UUID v4 Generator</h3>
          </div>

          <button
            onClick={generateBatch}
            className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Generate New Batch
          </button>
        </div>

        {/* Configuration Parameters */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Quantity & Formatting Options
            </span>

            {/* Quantity Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--ink-muted)] mr-1">Count:</span>
              {[1, 5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuantity(num)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    quantity === num
                      ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] font-semibold"
                      : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <input
                type="checkbox"
                checked={useHyphens}
                onChange={(e) => setUseHyphens(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-[var(--ink)] font-medium">Hyphens (-)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-[var(--ink)] font-medium">UPPERCASE</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <input
                type="checkbox"
                checked={useBraces}
                onChange={(e) => setUseBraces(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-[var(--ink)] font-medium">Braces &#123; &#125;</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <input
                type="checkbox"
                checked={outputFormat === "json"}
                onChange={(e) => setOutputFormat(e.target.checked ? "json" : "plain")}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span className="text-[var(--ink)] font-medium">JSON Array</span>
            </label>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--ink)]">
              Generated {uuids.length} UUID{uuids.length === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied All!" : "Copy All"}
              </button>

              <button
                onClick={downloadTxt}
                className="px-3 py-1 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          {outputFormat === "json" ? (
            <textarea
              readOnly
              rows={Math.min(15, uuids.length + 3)}
              value={formattedOutput}
              className="w-full font-mono text-xs p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] focus:outline-none"
            />
          ) : (
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {uuids.map((id, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--border)] text-xs font-mono group hover:border-[var(--ink)]/40 transition-colors"
                >
                  <span className="text-[var(--ink)] break-all select-all">{id}</span>
                  <button
                    onClick={() => handleCopySingle(id, index)}
                    className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors ml-2 shrink-0"
                    title="Copy UUID"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
