"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, Image as ImageIcon } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const FAVICON_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 }
];

export function FaviconGeneratorWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid square image file (PNG, JPG, SVG).");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"]
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

      const zip = new JSZip();

      for (const spec of FAVICON_SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = spec.size;
        canvas.height = spec.size;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          // Use image smoothing for better downscaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, spec.size, spec.size);

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Blob failed")), "image/png");
          });

          zip.file(spec.name, blob);
        }
      }

      // Add a simple basic ico file as well (we just wrap the 32x32 as .ico which many browsers accept as a fallback, or provide the pngs)
      // Standard practice today is dropping the 32x32 png in the root as favicon.ico (since modern browsers support png icons)
      const icoCanvas = document.createElement("canvas");
      icoCanvas.width = 32;
      icoCanvas.height = 32;
      const icoCtx = icoCanvas.getContext("2d");
      if (icoCtx) {
        icoCtx.drawImage(img, 0, 0, 32, 32);
        const icoBlob = await new Promise<Blob>((resolve) => {
          icoCanvas.toBlob((b) => resolve(b!), "image/png");
        });
        zip.file("favicon.ico", icoBlob);
      }

      // Add browserconfig.xml and site.webmanifest for standard completeness
      const manifestStr = `{
  "name": "",
  "short_name": "",
  "icons": [
      {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
      },
      {
          "src": "/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
      }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}`;
      zip.file("site.webmanifest", manifestStr);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "favicon_package.zip");
      URL.revokeObjectURL(objectUrl);

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to generate favicons.");
    } finally {
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
              isDragActive ? "border-accent bg-yellow/5" : "border-ink/15 hover:border-ink/25 hover:bg-paperHover",
              errorMsg ? "border-error/50 bg-error/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-paper">
                <ImageIcon className="w-8 h-8 text-grey" />
              </div>
              <div>
                <p className="text-lg font-medium text-ink">Drag & drop your Logo here</p>
                <p className="text-sm text-grey mt-1">to generate a complete favicon package</p>
                <p className="text-xs text-grey/70 mt-2">A square, transparent PNG or SVG works best.</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-paper border border-ink/15 rounded-md text-ink hover:bg-paperHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {file && (
        <div className="animate-reveal-result bg-paper rounded-lg border border-ink/10 p-4 sm:p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-ink font-medium">Selected Logo</h3>
            <button
              onClick={() => { setFile(null); }}
              className="text-sm text-grey hover:text-ink transition-colors"
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

          <div className="flex justify-center">
            <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center bg-black/20 rounded-xl p-8 border border-ink/10 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt="Favicon Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          
          <div className="text-center text-sm text-grey">
            We will generate 16x16, 32x32, 180x180 (Apple), and 192/512 (Android) icons, plus a webmanifest.
          </div>

          <div className="flex justify-end pt-4 border-t border-ink/10">
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-6 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-base flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? "Generating..." : "Download Zip Package"}
            </button>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
