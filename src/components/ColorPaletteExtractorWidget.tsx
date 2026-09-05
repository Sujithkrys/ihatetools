"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Palette, Copy, CheckCircle } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

interface ExtractedColor {
  hex: string;
  count: number;
}

export function ColorPaletteExtractorWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const colorDistance = (hex1: string, hex2: string) => {
    const r1 = parseInt(hex1.slice(1, 3), 16);
    const g1 = parseInt(hex1.slice(3, 5), 16);
    const b1 = parseInt(hex1.slice(5, 7), 16);
    
    const r2 = parseInt(hex2.slice(1, 3), 16);
    const g2 = parseInt(hex2.slice(3, 5), 16);
    const b2 = parseInt(hex2.slice(5, 7), 16);

    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  };

  const extractPalette = async (uploadedFile: File) => {
    setIsProcessing(true);
    setColors([]);
    setErrorMsg("");

    try {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(uploadedFile);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get canvas context");

      // Scale down image for faster processing
      const MAX_SIZE = 100;
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_SIZE || height > MAX_SIZE) {
        const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      const colorCounts: Record<string, number> = {};

      // Sample pixels (every 4th pixel to speed it up further)
      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Ignore fully transparent pixels
        if (a < 128) continue;

        // Group colors slightly by rounding to nearest 10 to merge very similar shades
        const round = (val: number) => Math.round(val / 10) * 10;
        const hex = rgbToHex(Math.min(255, round(r)), Math.min(255, round(g)), Math.min(255, round(b)));
        
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      // Sort by frequency
      const sortedColors = Object.entries(colorCounts)
        .map(([hex, count]) => ({ hex, count }))
        .sort((a, b) => b.count - a.count);

      // Filter visually distinct colors
      const distinctColors: ExtractedColor[] = [];
      const MIN_DISTANCE = 40; // Minimum RGB Euclidean distance

      for (const color of sortedColors) {
        if (distinctColors.length >= 6) break;
        
        const isDistinct = distinctColors.every(dc => colorDistance(dc.hex, color.hex) > MIN_DISTANCE);
        if (isDistinct) {
          distinctColors.push(color);
        }
      }

      // If we couldn't find 6 distinct colors, fill the rest with whatever is next most frequent
      if (distinctColors.length < 6) {
        for (const color of sortedColors) {
          if (distinctColors.length >= 6) break;
          if (!distinctColors.find(dc => dc.hex === color.hex)) {
            distinctColors.push(color);
          }
        }
      }

      setColors(distinctColors);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to extract color palette.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid image file.");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      extractPalette(acceptedFiles[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCopy = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex.toUpperCase());
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <ToolWidgetShell>
      {!file && (
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors tool-interaction-zone",
              isDragActive ? "border-accent bg-accent/5" : "border-overlay/10 hover:border-overlay/20 hover:bg-surfaceHover",
              errorMsg ? "border-error/50 bg-error/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-surface">
                <Palette className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop your Image here</p>
                <p className="text-sm text-textSecondary mt-1">to extract its color palette</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-surface border border-overlay/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {file && (
        <div className="animate-reveal-result bg-surface rounded-lg border border-overlay/5 p-4 sm:p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-textPrimary font-medium">Selected Image</h3>
            <button
              onClick={() => { setFile(null); setColors([]); }}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Change file
            </button>
          </div>
          
          <FileListItem
            file={file}
            index={0}
            totalFiles={1}
            onRemove={() => { setFile(null); setColors([]); }}
          />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex items-start justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt="Source preview"
                className="w-full max-w-xs rounded-lg shadow-lg border border-overlay/10 object-contain"
              />
            </div>

            <div className="w-full md:w-2/3">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="text-textSecondary text-sm">Sampling pixels...</p>
                </div>
              ) : colors.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-textSecondary mb-4">Extracted Palette</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {colors.map((color, index) => (
                      <div 
                        key={index} 
                        className="group flex flex-col items-center justify-center p-4 bg-background border border-overlay/5 rounded-lg hover:border-overlay/20 transition-colors"
                      >
                        <div 
                          className="w-16 h-16 rounded-full shadow-inner mb-3 border border-black/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <button
                          onClick={() => handleCopy(color.hex, index)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-overlay/5 hover:bg-overlay/10 rounded text-xs font-mono text-textPrimary transition-colors"
                        >
                          {copiedIndex === index ? <CheckCircle className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                          {color.hex.toUpperCase()}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-textSecondary">
                  No distinct colors found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
