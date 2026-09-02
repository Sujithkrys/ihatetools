"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { 
  UploadCloud, CheckCircle2, Loader2, AlertCircle, Download, Info, Settings2
} from "lucide-react";
import clsx from "clsx";
import { formatBytes } from "@/lib/utils";
import { FileListItem } from "./FileListItem";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

type CompressionMode = "standard" | "aggressive";

export function CompressPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<CompressionMode>("standard");
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>("");
  
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [newSize, setNewSize] = useState<number>(0);
  const [percentSaved, setPercentSaved] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only PDF files are supported.");
      return;
    }
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;
    
    setErrorMsg(null);
    setFile(uploadedFile);
    setOriginalSize(uploadedFile.size);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const handleCompress = async () => {
    if (!file) return;
    
    setStatus('processing');
    setErrorMsg(null);
    
    // Give UI time to update
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let finalBytes: Uint8Array;

      if (mode === "standard") {
        setProgressMsg("Optimizing PDF structure...");
        const pdf = await PDFDocument.load(arrayBuffer);
        finalBytes = await pdf.save({ useObjectStreams: true });
      } else {
        // Aggressive Mode
        setProgressMsg("Loading document...");
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        
        setProgressMsg("Creating optimized document...");
        const newPdf = await PDFDocument.create();

        for (let i = 1; i <= totalPages; i++) {
          setProgressMsg(`Rasterizing page ${i} of ${totalPages}...`);
          const page = await pdf.getPage(i);
          
          // Use 1.5 scale for aggressive compression (balance of size/readability)
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not create canvas context");
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: ctx, viewport }).promise;
          
          // Aggressive JPEG compression (0.6 quality)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          const base64Data = dataUrl.split(",")[1];
          const imgBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          
          const embeddedImage = await newPdf.embedJpg(imgBytes);
          const newPage = newPdf.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
        }
        
        setProgressMsg("Saving optimized file...");
        finalBytes = await newPdf.save({ useObjectStreams: true });
      }

      const blob = new Blob([finalBytes as unknown as BlobPart], { type: 'application/pdf' });
      
      const reduction = 1 - (blob.size / file.size);
      
      setNewSize(blob.size);
      setPercentSaved(Math.max(0, Math.round(reduction * 100)));
      
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('success');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(`Failed to compress: ${err.message}`);
      } else {
        setErrorMsg("An error occurred during compression.");
      }
      setStatus('idle');
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl(null);
    setErrorMsg(null);
    setStatus('idle');
  };

  if (status === 'success') {
    const isNegligible = percentSaved < 5;
    
    return (
      <ToolWidgetShell>
        <div className="flex flex-col items-center justify-center p-8 bg-surface border border-success/20 rounded-lg text-center">
          {isNegligible ? (
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
              <Info className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}
          
          <h3 className="text-2xl font-semibold text-textPrimary mb-2">
            {isNegligible ? "Optimization Complete" : "Compressed Successfully!"}
          </h3>
          
          <div className="text-textSecondary mb-8 max-w-sm">
            {isNegligible ? (
              <p>This PDF is already well-optimized — we couldn&apos;t reduce it further without using Aggressive mode.</p>
            ) : (
              <p>We reduced the file size by {percentSaved}%.<br/> From {formatBytes(originalSize)} to {formatBytes(newSize)}.</p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={downloadUrl!}
              download={file?.name.replace('.pdf', '-compressed.pdf')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-button hover:bg-accent/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-background border border-white/10 text-textPrimary font-medium rounded-button hover:bg-white/5 transition-colors"
            >
              Compress another
            </button>
          </div>
        </div>
      </ToolWidgetShell>
    );
  }

  return (
    <ToolWidgetShell>
      <div className="space-y-6">
        {!file ? (
          <div
            {...getRootProps()}
            className={clsx(
              "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors duration-200",
              isDragActive ? "border-accent bg-accent/5" : "border-white/20 bg-background/50 hover:border-white/30"
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className={clsx("w-12 h-12 mb-4", isDragActive ? "text-accent" : "text-textMuted")} />
            <h3 className="text-lg font-medium text-textPrimary mb-2">
              {isDragActive ? "Drop PDF here..." : "Drag & drop your PDF here"}
            </h3>
            <p className="text-textSecondary text-sm mb-6">or select one from your device</p>
            
            <button
              type="button"
              onClick={open}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open();
                }
              }}
              className="px-5 py-2.5 bg-surface border border-white/10 rounded-button text-textPrimary font-medium hover:bg-surfaceHover hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Browse files
            </button>
          </div>
        ) : (
          <div className="bg-background rounded-lg border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-surface flex justify-between items-center">
              <span className="font-medium text-textPrimary">Ready to compress</span>
            </div>
            <ul className="divide-y divide-white/10">
              <FileListItem file={file} onRemove={() => setFile(null)} />
            </ul>
          </div>
        )}

        {file && !status.includes('processing') && (
          <div className="bg-surface border border-white/10 rounded-lg p-6">
            <h3 className="text-textPrimary font-medium flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5" />
              Compression Mode
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMode("standard")}
                className={clsx(
                  "flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left",
                  mode === "standard" 
                    ? "border-accent bg-accent/5" 
                    : "border-white/5 bg-background hover:border-white/10"
                )}
              >
                <span className="font-medium text-textPrimary mb-1">Standard</span>
                <span className="text-sm text-textSecondary">Optimizes structure without losing text data.</span>
              </button>
              
              <button
                onClick={() => setMode("aggressive")}
                className={clsx(
                  "flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left",
                  mode === "aggressive" 
                    ? "border-error/50 bg-error/5" 
                    : "border-white/5 bg-background hover:border-white/10"
                )}
              >
                <span className="font-medium text-textPrimary mb-1">Aggressive</span>
                <span className="text-sm text-textSecondary">Maximum size reduction by converting pages to images.</span>
              </button>
            </div>

            {mode === "aggressive" && (
              <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-md flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <p className="text-sm text-error/90 leading-relaxed">
                  <strong className="block mb-1 text-error">Warning: Destructive Compression</strong>
                  This mode converts pages to images for maximum size reduction. Text will no longer be selectable, searchable, or copyable in the result.
                </p>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {file && (
          <button
            onClick={handleCompress}
            disabled={status === 'processing'}
            className={clsx(
              "w-full flex flex-col items-center justify-center gap-1 py-4 rounded-button font-medium transition-all",
              status === 'processing'
                ? "bg-white/5 text-textMuted cursor-not-allowed"
                : "bg-accent text-background hover:bg-accent/90 shadow-[0_0_20px_rgba(245,166,35,0.2)]"
            )}
          >
            {status === 'processing' ? (
              <>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-lg">Compressing PDF...</span>
                </div>
                {progressMsg && <span className="text-sm opacity-70 font-normal">{progressMsg}</span>}
              </>
            ) : (
              <span className="text-lg">Compress PDF</span>
            )}
          </button>
        )}
      </div>
    </ToolWidgetShell>
  );
}
