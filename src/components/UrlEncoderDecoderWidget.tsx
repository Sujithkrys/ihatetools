"use client";

import { useState, useMemo } from "react";
import {
  Copy,
  Check,
  ArrowRightLeft,
  Trash2,
  ListFilter,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export function UrlEncoderDecoderWidget() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeType, setEncodeType] = useState<"component" | "full" | "strict">("component");
  const [decodePlusAsSpace, setDecodePlusAsSpace] = useState(true);
  const [input, setInput] = useState("https://example.com/search?q=react & nextjs&filter=all#results");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Encode strict RFC3986
  const rfc3986 = (str: string) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  };

  const output = useMemo(() => {
    setError(null);
    if (!input) return "";

    try {
      if (mode === "encode") {
        if (encodeType === "full") {
          return encodeURI(input);
        } else if (encodeType === "strict") {
          return rfc3986(input);
        } else {
          return encodeURIComponent(input);
        }
      } else {
        // Decode mode
        let toDecode = input;
        if (decodePlusAsSpace) {
          toDecode = toDecode.replace(/\+/g, " ");
        }
        return decodeURIComponent(toDecode);
      }
    } catch {
      setError("Malformed URL or invalid percent-encoded sequence.");
      return "";
    }
  }, [input, mode, encodeType, decodePlusAsSpace]);

  // URL Breakdown Analysis
  const urlAnalysis = useMemo(() => {
    if (!input.trim()) return null;
    try {
      let target = input.trim();
      if (!target.startsWith("http://") && !target.startsWith("https://") && !target.startsWith("/")) {
        target = "http://" + target;
      }
      const url = new URL(target, "http://localhost");
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((val, key) => {
        params.push({ key, value: val });
      });

      return {
        protocol: url.protocol || "http:",
        host: url.host || "—",
        pathname: url.pathname || "/",
        hash: url.hash || "—",
        params,
      };
    } catch {
      return null;
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setMode((prev) => (prev === "encode" ? "decode" : "encode"));
    }
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("https://example.com/api/v1/search?category=electronics & gadgets&sort=price_asc#page=2");
    } else {
      setInput("https%3A%2F%2Fexample.com%2Fapi%2Fv1%2Fsearch%3Fcategory%3Delectronics%20%26%20gadgets%26sort%3Dprice_asc%23page%3D2");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "encode"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Encode URL
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "decode"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Decode URL
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--border)] transition-colors text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Load Sample
          </button>
          <button
            onClick={() => setInput("")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[var(--border)] bg-[var(--card)] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-300 transition-colors text-[var(--muted)]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Options Row */}
      <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        {mode === "encode" ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-[var(--foreground)]">Encoding Standard:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="encodeType"
                checked={encodeType === "component"}
                onChange={() => setEncodeType("component")}
                className="accent-[var(--accent)]"
              />
              Component (<code className="font-mono text-[10px] bg-[var(--background)] px-1 py-0.5 rounded border border-[var(--border)]">encodeURIComponent</code>)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="encodeType"
                checked={encodeType === "full"}
                onChange={() => setEncodeType("full")}
                className="accent-[var(--accent)]"
              />
              Full URI (<code className="font-mono text-[10px] bg-[var(--background)] px-1 py-0.5 rounded border border-[var(--border)]">encodeURI</code>)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[var(--foreground)]">
              <input
                type="radio"
                name="encodeType"
                checked={encodeType === "strict"}
                onChange={() => setEncodeType("strict")}
                className="accent-[var(--accent)]"
              />
              Strict RFC 3986
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="font-bold text-[var(--foreground)]">Decoding Rules:</span>
            <label className="flex items-center gap-2 cursor-pointer text-[var(--foreground)] font-medium">
              <input
                type="checkbox"
                checked={decodePlusAsSpace}
                onChange={(e) => setDecodePlusAsSpace(e.target.checked)}
                className="rounded accent-[var(--accent)]"
              />
              Decode &apos;+&apos; characters into spaces
            </label>
          </div>
        )}
      </div>

      {/* Input / Output Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {mode === "encode" ? "Raw URL / Text Input" : "Encoded URL Input"}
            </label>
            <span className="text-[11px] text-[var(--muted)] font-mono">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text or URL to encode..."
                : "Enter %-encoded URL to decode..."
            }
            rows={8}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y leading-relaxed text-[var(--foreground)]"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {mode === "encode" ? "Encoded Output" : "Decoded Output"}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                disabled={!output}
                title="Swap output into input"
                className="flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-40"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Swap
              </button>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 text-[11px] font-bold text-[var(--accent)] hover:opacity-80 disabled:opacity-40"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={output}
              placeholder="Output will appear here..."
              rows={8}
              className={`w-full bg-[var(--card)] border rounded-xl p-3 text-xs font-mono resize-y leading-relaxed text-[var(--foreground)] ${
                error ? "border-rose-400 bg-rose-500/5 text-rose-600" : "border-[var(--border)]"
              }`}
            />
            {error && (
              <div className="absolute inset-x-3 bottom-3 p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg flex items-center gap-2 text-rose-500 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Query Parameters Breakdown */}
      {urlAnalysis && urlAnalysis.params.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
            <ListFilter className="w-4 h-4 text-[var(--accent)]" />
            <span>Detected Query Parameters ({urlAnalysis.params.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] font-semibold">
                  <th className="py-2 px-3">Key</th>
                  <th className="py-2 px-3">Decoded Value</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {urlAnalysis.params.map((param, i) => (
                  <tr key={i} className="hover:bg-[var(--border)]/20">
                    <td className="py-2 px-3 font-bold text-amber-500 dark:text-amber-400">
                      {param.key}
                    </td>
                    <td className="py-2 px-3 text-[var(--foreground)] break-all">
                      {param.value}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => navigator.clipboard.writeText(param.value)}
                        className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] inline-flex items-center gap-1 font-sans"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* URL Overview Card */}
      {urlAnalysis && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg">
            <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Protocol</div>
            <div className="font-mono mt-0.5 text-[var(--foreground)] truncate">{urlAnalysis.protocol}</div>
          </div>
          <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg">
            <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Host</div>
            <div className="font-mono mt-0.5 text-[var(--foreground)] truncate">{urlAnalysis.host}</div>
          </div>
          <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg">
            <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Path</div>
            <div className="font-mono mt-0.5 text-[var(--foreground)] truncate">{urlAnalysis.pathname}</div>
          </div>
          <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg">
            <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Hash / Anchor</div>
            <div className="font-mono mt-0.5 text-[var(--foreground)] truncate">{urlAnalysis.hash}</div>
          </div>
        </div>
      )}
    </div>
  );
}
