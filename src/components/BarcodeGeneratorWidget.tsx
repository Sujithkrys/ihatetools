"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import JsBarcode from "jsbarcode";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  AlertCircle,
} from "lucide-react";

type BarcodeFormat = "CODE128" | "EAN13" | "UPC" | "EAN8" | "CODE39" | "ITF14";

const FORMAT_PRESETS: { id: BarcodeFormat; name: string; sample: string; hint: string }[] = [
  {
    id: "CODE128",
    name: "Code 128 (Universal)",
    sample: "IHATETOOLS-2026",
    hint: "Supports full ASCII alphanumeric characters. Most popular for shipping & logistics.",
  },
  {
    id: "EAN13",
    name: "EAN-13 (Retail)",
    sample: "590123412345",
    hint: "12 or 13 numeric digits. Used worldwide for retail products.",
  },
  {
    id: "UPC",
    name: "UPC-A (North America)",
    sample: "01234567890",
    hint: "11 or 12 numeric digits. Standard retail barcode in the US and Canada.",
  },
  {
    id: "EAN8",
    name: "EAN-8 (Small Package)",
    sample: "9638507",
    hint: "7 or 8 numeric digits. For small packages with limited label space.",
  },
  {
    id: "CODE39",
    name: "Code 39",
    sample: "CODE-39-PRO",
    hint: "Uppercase letters, numbers, and basic symbols (- . $ / + % space).",
  },
  {
    id: "ITF14",
    name: "ITF-14 (Cartons)",
    sample: "1001234567890",
    hint: "13 or 14 digits. Used for packaging boxes and corrugated cardboard.",
  },
];

export function BarcodeGeneratorWidget() {
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [value, setValue] = useState("IHATETOOLS-2026");

  // Customization
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const fontSize = 16;
  const margin = 12;
  const lineColor = "#000000";
  const background = "#ffffff";

  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const renderBarcode = useCallback(() => {
    if (!svgRef.current || !value.trim()) return;
    setErrorMsg("");

    try {
      JsBarcode(svgRef.current, value.trim(), {
        format,
        width,
        height,
        displayValue,
        fontSize,
        margin,
        lineColor,
        background,
        valid: (valid) => {
          if (!valid) {
            setErrorMsg(`The entered text is not valid for ${format} format.`);
          }
        },
      });
    } catch (err: unknown) {
      console.warn("JsBarcode error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Invalid barcode input for selected format.");
    }
  }, [format, value, width, height, displayValue, fontSize, margin, lineColor, background]);

  useEffect(() => {
    renderBarcode();
  }, [renderBarcode]);

  const handleFormatChange = (newFormat: BarcodeFormat) => {
    setFormat(newFormat);
    const preset = FORMAT_PRESETS.find((f) => f.id === newFormat);
    if (preset) setValue(preset.sample);
  };

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode_${format.toLowerCase()}_${value.trim()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const URLObject = window.URL || window.webkitURL || window;
    const blobURL = URLObject.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Use 2x scale for sharp high-res PNG export
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `barcode_${format.toLowerCase()}_${value.trim()}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
        URLObject.revokeObjectURL(blobURL);
      }, "image/png");
    };
    img.src = blobURL;
  };

  const copyImage = async () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          console.error("Clipboard copy failed", e);
        }
        URL.revokeObjectURL(blobURL);
      }, "image/png");
    };
    img.src = blobURL;
  };

  const currentPreset = FORMAT_PRESETS.find((f) => f.id === format);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Options Column */}
        <div className="lg:col-span-1 space-y-5">
          {/* Format Picker */}
          <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <label className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider block">
              Barcode Standard
            </label>
            <div className="space-y-1.5">
              {FORMAT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleFormatChange(p.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    format === p.id
                      ? "border-[var(--primary)] bg-[var(--paper)] text-[var(--ink)] shadow-sm ring-1 ring-[var(--primary)]"
                      : "border-[var(--border)] hover:border-[var(--ink)] text-[var(--ink-muted)] bg-transparent"
                  }`}
                >
                  <div className="font-bold">{p.name}</div>
                </button>
              ))}
            </div>
            {currentPreset && (
              <p className="text-[11px] text-[var(--ink-muted)] pt-1 leading-relaxed">
                {currentPreset.hint}
              </p>
            )}
          </div>

          {/* Sizing & Appearance Options */}
          <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Barcode Sizing
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[var(--ink)] font-semibold mb-1">
                  <span>Bar Width</span>
                  <span>{width}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[var(--ink)] font-semibold mb-1">
                  <span>Bar Height</span>
                  <span>{height}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border)] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayValue}
                    onChange={(e) => setDisplayValue(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--primary)]"
                  />
                  <span className="text-[var(--ink)] font-medium">Show human-readable text</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Text Input */}
          <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                Barcode Content
              </label>
              <button
                onClick={() => {
                  const p = FORMAT_PRESETS.find((f) => f.id === format);
                  if (p) setValue(p.sample);
                }}
                className="text-xs text-[var(--primary)] hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Load Sample Value
              </button>
            </div>

            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter barcode string or number..."
              className="w-full text-base font-mono p-3 bg-[var(--paper)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--primary)] text-[var(--ink)] tracking-wider"
            />

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Barcode Render Display */}
          <div className="p-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center min-h-[300px] space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 flex justify-center items-center max-w-full overflow-x-auto">
              <svg ref={svgRef} className="max-w-full h-auto block" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={downloadPng}
                disabled={Boolean(errorMsg) || !value.trim()}
                className="px-5 py-2.5 bg-[var(--ink)] text-[var(--paper)] text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 inline-flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>

              <button
                onClick={downloadSvg}
                disabled={Boolean(errorMsg) || !value.trim()}
                className="px-5 py-2.5 bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)] text-sm font-semibold rounded-lg hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-40 inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Vector SVG
              </button>

              <button
                onClick={copyImage}
                disabled={Boolean(errorMsg) || !value.trim()}
                className="px-4 py-2.5 bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)] text-sm font-semibold rounded-lg hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-40 inline-flex items-center gap-2"
                title="Copy PNG to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied Image!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
