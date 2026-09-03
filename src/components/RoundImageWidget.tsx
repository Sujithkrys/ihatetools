"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, Circle, Square } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

type CropShape = "rounded" | "circle";

export function RoundImageWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shape, setShape] = useState<CropShape>("rounded");
  const [radius, setRadius] = useState<number>(30);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg("");
      setShape("rounded");
      setRadius(30);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  const handleDownload = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const width = img.width;
      const height = img.height;

      // If circle, we need to crop to a square first
      if (shape === "circle") {
        const size = Math.min(width, height);
        canvas.width = size;
        canvas.height = size;
        
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        // Draw image centered and scaled to cover the circle
        const scale = Math.max(size / width, size / height);
        const x = (size / 2) - (width / 2) * scale;
        const y = (size / 2) - (height / 2) * scale;
        ctx.drawImage(img, x, y, width * scale, height * scale);
      } else {
        canvas.width = width;
        canvas.height = height;

        ctx.beginPath();
        // Fallback for roundRect if not available, but roundRect is widely supported in modern browsers
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(0, 0, width, height, radius);
        } else {
          // Manual fallback
          ctx.moveTo(radius, 0);
          ctx.lineTo(width - radius, 0);
          ctx.quadraticCurveTo(width, 0, width, radius);
          ctx.lineTo(width, height - radius);
          ctx.quadraticCurveTo(width, height, width - radius, height);
          ctx.lineTo(radius, height);
          ctx.quadraticCurveTo(0, height, 0, height - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
        }
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, width, height);
      }

      URL.revokeObjectURL(objectUrl);
      
      // Always use PNG to preserve transparency
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error("Compression failed");
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          a.download = `${baseName}-rounded.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsProcessing(false);
        },
        "image/png"
      );

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to process image.");
      setIsProcessing(false);
    }
  };

  const getPreviewStyle = () => {
    if (shape === "circle") {
      return { borderRadius: "50%", objectFit: "cover" as const, aspectRatio: "1/1" };
    }
    return { borderRadius: `${radius}px`, objectFit: "contain" as const };
  };

  return (
    <ToolWidgetShell>
      {!file && (
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
              isDragActive ? "border-accent bg-accent/5" : "border-white/10 hover:border-white/20 hover:bg-surfaceHover",
              errorMsg ? "border-error/50 bg-error/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-surface">
                <Circle className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop your Image here</p>
                <p className="text-sm text-textSecondary mt-1">to add rounded corners or circle crop</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-surface border border-white/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {file && (
        <div className="bg-surface rounded-lg border border-white/5 p-4 sm:p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-textPrimary font-medium">Selected Image</h3>
            <button
              onClick={() => { setFile(null); }}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Change file
            </button>
          </div>
          
          <FileListItem
            file={file}
            index={0}
            totalFiles={1}
            onRemove={() => { setFile(null); }}
          />

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
            {/* Preview Area */}
            <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center bg-black/20 rounded-xl p-4 overflow-hidden" 
                 style={{ backgroundImage: "linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={getPreviewStyle()}
                className="max-w-full max-h-full transition-all duration-300 ease-in-out shadow-2xl"
              />
            </div>
            
            {/* Controls Area */}
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-textSecondary">Shape</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShape("rounded")}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-4 border rounded-lg transition-colors",
                      shape === "rounded" ? "bg-accent/20 border-accent text-accent" : "bg-white/5 border-white/10 text-textSecondary hover:bg-white/10 hover:text-textPrimary"
                    )}
                  >
                    <Square className="w-6 h-6" rx={10} />
                    <span className="text-sm font-medium">Rounded Corners</span>
                  </button>
                  <button
                    onClick={() => setShape("circle")}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-4 border rounded-lg transition-colors",
                      shape === "circle" ? "bg-accent/20 border-accent text-accent" : "bg-white/5 border-white/10 text-textSecondary hover:bg-white/10 hover:text-textPrimary"
                    )}
                  >
                    <Circle className="w-6 h-6" />
                    <span className="text-sm font-medium">Circle Crop</span>
                  </button>
                </div>
              </div>

              {shape === "rounded" && (
                <div className="space-y-4">
                  <label className="flex justify-between text-sm font-medium text-textSecondary">
                    <span>Corner Radius</span>
                    <span>{radius}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    value={radius} 
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              )}
              
              <div className="pt-4 text-sm text-textSecondary border-t border-white/5">
                Output will be exported as a transparent PNG file to preserve the cropped corners.
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? "Processing..." : "Download Transparent PNG"}
            </button>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
