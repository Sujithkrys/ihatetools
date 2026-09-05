"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, EyeOff, X, Grid } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

type Region = { x: number, y: number, w: number, h: number };
type Mode = "blur" | "pixelate";

export function BlurImageRegionWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState<Mode>("blur");
  const [intensity, setIntensity] = useState(10); // Blur radius or Pixelate block size
  
  // Selection state
  const [regions, setRegions] = useState<Region[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid image file.");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg("");
      setRegions([]);
      setCurrentRegion(null);
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

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || !imgRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Support touch and mouse
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    
    // Map visual coordinates to natural image coordinates
    const scaleX = imgRef.current.naturalWidth / rect.width;
    const scaleY = imgRef.current.naturalHeight / rect.height;
    
    return {
      visual: { x, y },
      natural: { x: x * scaleX, y: y * scaleY }
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDragging(true);
    setStartPos(coords.natural);
    setCurrentRegion({ x: coords.natural.x, y: coords.natural.y, w: 0, h: 0 });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !startPos) return;
    
    const coords = getCoordinates(e);
    if (!coords) return;
    
    const x = Math.min(startPos.x, coords.natural.x);
    const y = Math.min(startPos.y, coords.natural.y);
    const w = Math.abs(coords.natural.x - startPos.x);
    const h = Math.abs(coords.natural.y - startPos.y);
    
    setCurrentRegion({ x, y, w, h });
  };

  const handlePointerUp = () => {
    if (isDragging && currentRegion && currentRegion.w > 10 && currentRegion.h > 10) {
      setRegions([...regions, currentRegion]);
    }
    setIsDragging(false);
    setStartPos(null);
    setCurrentRegion(null);
  };
  
  // Render visual selection boxes
  const renderSelectionBox = (region: Region, isTemp = false) => {
    if (!containerRef.current || !imgRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / imgRef.current.naturalWidth;
    const scaleY = rect.height / imgRef.current.naturalHeight;
    
    return (
      <div 
        key={isTemp ? 'temp' : `reg-${region.x}-${region.y}`}
        className={cn(
          "absolute border-2 pointer-events-none",
          isTemp ? "border-accent border-dashed bg-accent/20 tool-interaction-zone" : "border-white bg-black/40 backdrop-blur-sm"
        )}
        style={{
          left: region.x * scaleX,
          top: region.y * scaleY,
          width: region.w * scaleX,
          height: region.h * scaleY
        }}
      >
        {!isTemp && (
          <button 
            className="absolute -top-3 -right-3 w-6 h-6 bg-error rounded-full text-white flex items-center justify-center pointer-events-auto shadow-lg hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              setRegions(regions.filter(r => r !== region));
            }}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  const handleDownload = async () => {
    if (!file || !imgRef.current || regions.length === 0) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Could not get canvas context");

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Create an offscreen canvas for the effect
      const effectCanvas = document.createElement("canvas");
      effectCanvas.width = img.naturalWidth;
      effectCanvas.height = img.naturalHeight;
      const effectCtx = effectCanvas.getContext("2d");
      
      if (!effectCtx) throw new Error("Could not get effect canvas context");

      if (mode === "blur") {
        effectCtx.filter = `blur(${intensity}px)`;
        effectCtx.drawImage(img, 0, 0);
      } else {
        // Pixelate effect manually (or via downscale/upscale)
        const scale = 1 / (intensity / 2); // Block size mapped to a scale
        const scaledWidth = Math.max(1, Math.floor(img.naturalWidth * scale));
        const scaledHeight = Math.max(1, Math.floor(img.naturalHeight * scale));
        
        effectCtx.imageSmoothingEnabled = false;
        effectCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
        // Clear and redraw upscaled
        effectCtx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
        effectCtx.drawImage(effectCanvas, 0, 0, scaledWidth, scaledHeight, 0, 0, img.naturalWidth, img.naturalHeight);
      }

      // Draw the effected regions back onto the main canvas
      for (const r of regions) {
        ctx.drawImage(
          effectCanvas, 
          r.x, r.y, r.w, r.h, // Source
          r.x, r.y, r.w, r.h  // Destination
        );
      }

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error("Compression failed");
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const ext = file.type === "image/png" ? ".png" : ".jpg";
          a.download = `${baseName}-redacted${ext}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsProcessing(false);
        },
        mimeType,
        0.95
      );

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to process image.");
      setIsProcessing(false);
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
                <EyeOff className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop your Image here</p>
                <p className="text-sm text-textSecondary mt-1">to blur or pixelate sensitive regions</p>
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
              onClick={() => { setFile(null); setRegions([]); }}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Change file
            </button>
          </div>
          
          <FileListItem
            file={file}
            index={0}
            totalFiles={1}
            onRemove={() => { setFile(null); setRegions([]); }}
          />

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Editor Area */}
            <div className="w-full md:w-2/3 flex flex-col items-center select-none">
              <p className="text-sm text-textSecondary mb-2">Click and drag over the image to select areas</p>
              
              <div 
                ref={containerRef}
                className="relative inline-block cursor-crosshair overflow-hidden rounded shadow-xl"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  ref={imgRef}
                  src={URL.createObjectURL(file)} 
                  alt="Editor canvas" 
                  className="max-w-full max-h-[60vh] object-contain pointer-events-none"
                />
                
                {regions.map(r => renderSelectionBox(r))}
                {currentRegion && isDragging && renderSelectionBox(currentRegion, true)}
              </div>
            </div>

            {/* Controls Area */}
            <div className="w-full md:w-1/3 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-textSecondary">Obfuscation Mode</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setMode("blur")}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-4 border rounded-lg transition-colors",
                      mode === "blur" ? "bg-accent/20 border-accent text-accent" : "bg-overlay/5 border-overlay/10 text-textSecondary hover:bg-overlay/10 hover:text-textPrimary"
                    )}
                  >
                    <EyeOff className="w-5 h-5" />
                    <span className="text-sm font-medium">Blur</span>
                  </button>
                  <button
                    onClick={() => setMode("pixelate")}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-4 border rounded-lg transition-colors",
                      mode === "pixelate" ? "bg-accent/20 border-accent text-accent" : "bg-overlay/5 border-overlay/10 text-textSecondary hover:bg-overlay/10 hover:text-textPrimary"
                    )}
                  >
                    <Grid className="w-5 h-5" />
                    <span className="text-sm font-medium">Pixelate</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex justify-between text-sm font-medium text-textSecondary">
                  <span>Intensity</span>
                  <span>{intensity}</span>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="50" 
                  value={intensity} 
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-overlay/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div className="pt-4 border-t border-overlay/5 text-sm text-textSecondary">
                Selected regions: <span className="font-medium text-textPrimary">{regions.length}</span>
                {regions.length === 0 && (
                  <p className="mt-1 text-xs text-accent">Drag on the image to add a region.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-overlay/5">
            <button
              onClick={handleDownload}
              disabled={isProcessing || regions.length === 0}
              className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? "Processing..." : "Download Redacted Image"}
            </button>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
