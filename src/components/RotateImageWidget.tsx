"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, RotateCw, RotateCcw } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function RotateImageWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rotation, setRotation] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg("");
      setRotation(0);
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

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

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

      // Calculate new dimensions
      const rads = (rotation * Math.PI) / 180;
      
      let newWidth = img.width;
      let newHeight = img.height;

      if (Math.abs(rotation) === 90 || Math.abs(rotation) === 270) {
        newWidth = img.height;
        newHeight = img.width;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(rads);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      URL.revokeObjectURL(objectUrl);

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error("Compression failed");
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const ext = file.type === "image/png" ? ".png" : ".jpg";
          a.download = `${baseName}-rotated${ext}`;
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
      setErrorMsg("Failed to rotate image.");
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
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
              isDragActive ? "border-accent bg-accent/5" : "border-white/10 hover:border-white/20 hover:bg-surfaceHover",
              errorMsg ? "border-error/50 bg-error/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-surface">
                <RotateCw className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop your Image here</p>
                <p className="text-sm text-textSecondary mt-1">to rotate it quickly</p>
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
              onClick={() => { setFile(null); setRotation(0); }}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Change file
            </button>
          </div>
          
          <FileListItem
            file={file}
            index={0}
            totalFiles={1}
            onRemove={() => { setFile(null); setRotation(0); }}
          />

          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-md aspect-square bg-background border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.3s ease" }}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleRotate(-90)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-textPrimary rounded-md font-medium transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Left 90°
              </button>
              <button
                onClick={() => handleRotate(180)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-textPrimary rounded-md font-medium transition-colors"
              >
                180°
              </button>
              <button
                onClick={() => handleRotate(90)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-textPrimary rounded-md font-medium transition-colors"
              >
                <RotateCw className="w-5 h-5" />
                Right 90°
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isProcessing ? "Processing..." : "Download Rotated Image"}
            </button>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
