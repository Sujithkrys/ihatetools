"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

type VerticalPosition = "top" | "center" | "bottom";

export function AddTextToImageWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [text, setText] = useState("Your text here");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [vPos, setVPos] = useState<VerticalPosition>("bottom");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg("");
      
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(acceptedFiles[0]);
      img.onload = () => {
        imgRef.current = img;
        drawPreview();
      };
      img.src = objectUrl;
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

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // To prevent giant canvas rendering freezing the UI, we scale down preview if too large
    const MAX_PREVIEW_SIZE = 1000;
    let scale = 1;
    if (img.width > MAX_PREVIEW_SIZE || img.height > MAX_PREVIEW_SIZE) {
      scale = Math.min(MAX_PREVIEW_SIZE / img.width, MAX_PREVIEW_SIZE / img.height);
    }

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Draw Image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (!text.trim()) return;

    // Draw Text
    // Scale font size according to preview scale
    const scaledFontSize = fontSize * scale;
    ctx.font = `bold ${scaledFontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Text stroke for visibility
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = Math.max(2, scaledFontSize / 10);
    ctx.lineJoin = "round";

    const x = canvas.width / 2;
    let y = 0;

    const padding = scaledFontSize;
    if (vPos === "top") {
      y = padding;
    } else if (vPos === "center") {
      y = canvas.height / 2;
    } else {
      y = canvas.height - padding;
    }

    // Split text by newlines
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      const lineY = y + (index * scaledFontSize * 1.2);
      ctx.strokeText(line, x, lineY);
      ctx.fillText(line, x, lineY);
    });

  }, [text, fontSize, color, vPos]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const handleDownload = async () => {
    if (!file || !imgRef.current) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw full resolution image
      ctx.drawImage(img, 0, 0);

      if (text.trim()) {
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = Math.max(2, fontSize / 10);
        ctx.lineJoin = "round";

        const x = canvas.width / 2;
        let y = 0;
        const padding = fontSize;

        if (vPos === "top") {
          y = padding;
        } else if (vPos === "center") {
          y = canvas.height / 2;
        } else {
          y = canvas.height - padding;
        }

        const lines = text.split('\n');
        lines.forEach((line, index) => {
          const lineY = y + (index * fontSize * 1.2);
          ctx.strokeText(line, x, lineY);
          ctx.fillText(line, x, lineY);
        });
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
          a.download = `${baseName}-captioned${ext}`;
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
                <Type className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop your Image here</p>
                <p className="text-sm text-textSecondary mt-1">to add text and captions</p>
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
              onClick={() => { setFile(null); imgRef.current = null; }}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Change file
            </button>
          </div>
          
          <FileListItem
            file={file}
            index={0}
            totalFiles={1}
            onRemove={() => { setFile(null); imgRef.current = null; }}
          />

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Controls Area */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Text Content</label>
                <textarea 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here..."
                  className="w-full bg-background border border-overlay/10 rounded-md px-4 py-3 text-textPrimary focus:outline-none focus:border-accent min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Font Size (px)</label>
                <input 
                  type="number" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(Math.max(1, parseInt(e.target.value) || 12))}
                  className="w-full bg-background border border-overlay/10 rounded-md px-4 py-3 text-textPrimary focus:outline-none focus:border-accent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Text Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 bg-transparent rounded cursor-pointer p-1"
                  />
                  <input 
                    type="text" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 bg-background border border-overlay/10 rounded-md px-4 py-3 text-textPrimary focus:outline-none focus:border-accent font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Vertical Position</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setVPos("top")}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 py-3 border rounded-md transition-colors",
                      vPos === "top" ? "bg-accent/20 border-accent text-accent" : "bg-overlay/5 border-overlay/10 text-textSecondary hover:bg-overlay/10 hover:text-textPrimary"
                    )}
                  >
                    <AlignLeft className="w-5 h-5 rotate-90" />
                    <span className="text-xs font-medium">Top</span>
                  </button>
                  <button
                    onClick={() => setVPos("center")}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 py-3 border rounded-md transition-colors",
                      vPos === "center" ? "bg-accent/20 border-accent text-accent" : "bg-overlay/5 border-overlay/10 text-textSecondary hover:bg-overlay/10 hover:text-textPrimary"
                    )}
                  >
                    <AlignCenter className="w-5 h-5 rotate-90" />
                    <span className="text-xs font-medium">Center</span>
                  </button>
                  <button
                    onClick={() => setVPos("bottom")}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 py-3 border rounded-md transition-colors",
                      vPos === "bottom" ? "bg-accent/20 border-accent text-accent" : "bg-overlay/5 border-overlay/10 text-textSecondary hover:bg-overlay/10 hover:text-textPrimary"
                    )}
                  >
                    <AlignRight className="w-5 h-5 rotate-90" />
                    <span className="text-xs font-medium">Bottom</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="w-full lg:w-2/3 flex flex-col items-center">
              <div className="relative w-full max-w-full bg-black/20 rounded-xl p-2 border border-overlay/5 flex justify-center overflow-hidden">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-[600px] object-contain shadow-2xl rounded"
                />
              </div>
              <p className="text-sm text-textSecondary mt-3 text-center">Live Preview</p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-overlay/5">
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? "Processing..." : "Download Image"}
            </button>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
