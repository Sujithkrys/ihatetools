"use client";

import { useState } from "react";
import { Download, ImageIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function Base64ToImageWidget() {
  const [base64Input, setBase64Input] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleProcess = () => {
    setErrorMsg("");
    setImgUrl(null);

    const input = base64Input.trim();
    if (!input) {
      setErrorMsg("Please paste a Base64 string.");
      return;
    }

    // Check if it already has a data URI scheme
    let finalSrc = input;
    if (!input.startsWith("data:image/")) {
      // Attempt to prepend a generic png data URI if missing
      finalSrc = `data:image/png;base64,${input}`;
    }

    const img = new window.Image();
    img.onload = () => {
      setImgUrl(finalSrc);
    };
    img.onerror = () => {
      setErrorMsg("Invalid Base64 image data. Make sure you copied the entire string.");
    };
    img.src = finalSrc;
  };

  const handleReset = () => {
    setBase64Input("");
    setImgUrl(null);
    setErrorMsg("");
  };

  const getExt = () => {
    if (!imgUrl) return "png";
    const match = imgUrl.match(/data:image\/([a-zA-Z0-9]+);/);
    return match ? match[1] : "png";
  };

  return (
    <ToolWidgetShell>
      {!imgUrl && (
        <div className="space-y-6">
          <div className="bg-surface rounded-lg border border-overlay/5 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-overlay/5">
                <ImageIcon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-textPrimary">Paste Base64 String</h3>
                <p className="text-sm text-textSecondary">Supports raw base64 or complete data URIs</p>
              </div>
            </div>

            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
              className={cn(
                "w-full h-48 bg-background border rounded-md p-4 text-textPrimary font-mono text-xs focus:outline-none focus:border-accent resize-none",
                errorMsg ? "border-error/50" : "border-overlay/10"
              )}
            />
            {errorMsg && (
              <p className="text-error text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {errorMsg}
              </p>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleProcess}
                className="px-6 py-2 bg-accent hover:bg-accent/90 text-background font-medium rounded-md transition-colors"
              >
                Render Image
              </button>
            </div>
          </div>
        </div>
      )}

      {imgUrl && (
        <div className="bg-surface rounded-lg border border-overlay/5 p-4 sm:p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-textPrimary font-medium">Rendered Image</h3>
            <button
              onClick={handleReset}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Convert another string
            </button>
          </div>
          
          <div className="flex justify-center bg-black/20 rounded-xl p-4 border border-overlay/5 overflow-hidden"
               style={{ backgroundImage: "linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgUrl} 
              alt="Base64 Preview" 
              className="max-w-full max-h-[500px] object-contain shadow-xl"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-overlay/5">
            <a
              href={imgUrl}
              download={`decoded-image.${getExt()}`}
              className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download .{getExt()}
            </a>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
