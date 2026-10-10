"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, Minimize2, Image as ImageIcon } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function CompressImageTargetSizeWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");
  const [resultInfo, setResultInfo] = useState<{ size: number; kb: number; quality: number } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg("");
      setDownloadUrl(null);
      setResultInfo(null);
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

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const targetBytes = targetKb * 1024;
      const mime = "image/jpeg"; // PNG cannot be easily size-targeted with quality, always use JPEG for aggressive compression
      
      let low = 0.0;
      let high = 1.0;
      let bestBlob: Blob | null = null;
      let bestBlobSizeDiff = Infinity;
      let bestQuality = 0;
      let currentQuality = 0.5;

      const maxIterations = 8;
      
      for (let i = 0; i < maxIterations; i++) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Compression failed"));
            },
            mime,
            currentQuality
          );
        });

        if (blob.size <= targetBytes) {
          if (targetBytes - blob.size < bestBlobSizeDiff) {
            bestBlob = blob;
            bestBlobSizeDiff = targetBytes - blob.size;
            bestQuality = currentQuality;
          }
          low = currentQuality;
          currentQuality = (currentQuality + high) / 2;
        } else {
          high = currentQuality;
          currentQuality = (low + currentQuality) / 2;
        }
      }

      // If it's impossible to hit the target, just use quality 0
      if (!bestBlob) {
        bestBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Compression failed"));
            },
            mime,
            0.0
          );
        });
        bestQuality = 0;
      }

      const url = URL.createObjectURL(bestBlob);
      setDownloadUrl(url);
      setResultInfo({
        size: bestBlob.size,
        kb: bestBlob.size / 1024,
        quality: bestQuality
      });
      
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFilename(`${baseName}-compressed.jpg`);

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl(null);
    setResultInfo(null);
    setErrorMsg("");
  };

  return (
    <ToolWidgetShell>
      {!downloadUrl && !isProcessing && (
        <div className="space-y-6">
          {!file ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-[16px] p-12 text-center cursor-pointer transition-all tool-interaction-zone",
                isDragActive
                  ? "border-ink/40 dark:border-white/40 bg-ink/[0.03] dark:bg-white/[0.03]"
                  : "border-ink/15 dark:border-white/15 hover:border-ink/25 dark:hover:border-white/25 hover:bg-ink/[0.015] dark:hover:bg-white/[0.02]",
                errorMsg ? "border-pink/40 bg-pink/5" : ""
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-ink/5 dark:bg-white/5">
                  <Minimize2 className="w-6 h-6 text-grey" />
                </div>
                <div>
                  <p className="text-lg font-medium text-ink">Drag & drop your Image here</p>
                  <p className="text-sm text-grey mt-1">to compress it to a target size</p>
                </div>
                <button className="mt-2 px-5 py-2.5 bg-ink text-paper rounded-[9px] text-[13.5px] font-medium shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all">
                  Browse files
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-paper rounded-[16px] border border-ink/8 dark:border-white/10 shadow-soft dark:shadow-soft-dark p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-ink font-medium">Selected Image</h3>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-grey hover:text-ink transition-colors"
                >
                  Change file
                </button>
              </div>
              
              <FileListItem
                file={file}
                index={0}
                totalFiles={1}
                onRemove={() => setFile(null)}
              />

              <div className="mt-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-grey mb-2">Target Size (KB)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      value={targetKb} 
                      onChange={(e) => setTargetKb(Math.max(1, parseInt(e.target.value) || 100))}
                      className="flex-1 bg-bg border border-ink/8 dark:border-white/10 rounded-[14px] px-4 py-3 text-ink focus:outline-none focus:border-sel text-lg"
                      min="1"
                    />
                    <span className="text-grey font-medium">KB</span>
                  </div>
                  <p className="text-sm text-grey mt-2">
                    Note: Output will always be a JPEG to maximize compression. We will try to get as close as possible to this target.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleCompress}
                  className="px-6 py-3 bg-ink text-paper rounded-[10px] shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all font-medium text-base flex items-center gap-2"
                >
                  <Minimize2 className="w-5 h-5" />
                  Compress Image
                </button>
              </div>
            </div>
          )}

          {errorMsg && <p className="text-pink text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-sel animate-spin mb-4" />
          <p className="text-ink font-medium">Iterating compression levels...</p>
        </div>
      )}

      {downloadUrl && resultInfo && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-sel/20 rounded-full flex items-center justify-center mb-2">
            <ImageIcon className="w-8 h-8 text-sel" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">Compression Complete!</h3>
            {resultInfo.kb <= targetKb ? (
              <p className="text-sel mt-2 font-medium">Success! Target met.</p>
            ) : (
              <p className="text-warning mt-2 font-medium">Could not reach target size even at minimum quality.</p>
            )}

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="bg-bg rounded-[14px] border border-ink/8 dark:border-white/10 p-4 text-center">
                <p className="text-sm text-grey mb-1">Target</p>
                <p className="font-bold text-ink">{targetKb} KB</p>
              </div>
              <div className="text-grey">→</div>
              <div className="bg-bg rounded-[14px] border border-ink/8 dark:border-white/10 p-4 text-center">
                <p className="text-sm text-grey mb-1">Achieved</p>
                <p className="font-bold text-sel">{resultInfo.kb.toFixed(2)} KB</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-ink text-paper rounded-[10px] shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download JPG
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-grey hover:text-ink underline underline-offset-4 text-sm mt-4"
          >
            Compress another image
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
