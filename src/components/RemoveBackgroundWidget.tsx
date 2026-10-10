"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  UploadCloud, CheckCircle2, AlertCircle, Download, Loader2
} from "lucide-react";
import clsx from "clsx";
import { FileListItem } from "./FileListItem";

interface ProcessedFile {
  originalFile: File;
  originalUrl: string;
  blob: Blob;
  resultUrl: string;
}

export function RemoveBackgroundWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<string>("");
  
  const [bgColor, setBgColor] = useState<string>("transparent");

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only JPG, PNG, and WEBP images are supported.");
    } else {
      setErrorMsg(null);
    }
    
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Only one file for bg removal
      setProcessedFile(null);
      setStatus('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const removeSelectedFile = () => {
    setFile(null);
    setProcessedFile(null);
    setStatus('idle');
  };

  const handleProcess = async () => {
    if (!file) return;
    
    // In a real app we might check if model is already downloaded, but imgly handles caching
    setStatus('loading_model');
    setErrorMsg(null);
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = {
        publicPath: window.location.origin + "/bg-removal-models/",
        model: "small", 
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) {
            setDownloadProgress(`Downloading AI model: ${Math.round((current/total)*100)}% (~40MB, one-time)`);
          } else if (key.includes("compute")) {
            setStatus('processing');
          }
        }
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { removeBackground } = (await import("@imgly/background-removal")) as any;
      const blob = await removeBackground(file, config);
      
      const originalUrl = URL.createObjectURL(file);
      const resultUrl = URL.createObjectURL(blob);
      
      setProcessedFile({
        originalFile: file,
        originalUrl,
        blob,
        resultUrl
      });
      
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An error occurred during background removal.");
      }
      setStatus('idle');
    }
  };

  const handleReset = () => {
    if (processedFile) {
      URL.revokeObjectURL(processedFile.originalUrl);
      URL.revokeObjectURL(processedFile.resultUrl);
    }
    setFile(null);
    setProcessedFile(null);
    setErrorMsg(null);
    setStatus('idle');
  };

  // Compose with background color if not transparent
  const handleDownload = async () => {
    if (!processedFile) return;
    
    if (bgColor === "transparent") {
      const a = document.createElement("a");
      a.href = processedFile.resultUrl;
      a.download = processedFile.originalFile.name.replace(/\.[^/.]+$/, "") + "-nobg.png";
      a.click();
      return;
    }
    
    // Draw onto canvas with bg color
    const img = new Image();
    img.src = processedFile.resultUrl;
    await new Promise(resolve => img.onload = resolve);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    canvas.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url;
      a.download = processedFile.originalFile.name.replace(/\.[^/.]+$/, "") + "-bg-" + bgColor.replace("#","") + ".png";
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  if (status === 'success' && processedFile) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-paper border border-green/20 rounded-[16px] shadow-soft dark:shadow-soft-dark">
        <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-ink mb-6 text-center">Background Removed!</h3>

        <div className="w-full max-w-4xl bg-bg border border-ink/8 dark:border-white/10 rounded-[16px] overflow-hidden mb-8 flex flex-col md:flex-row p-4 gap-6">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-grey mb-3 uppercase tracking-wider">Original</h4>
            <div className="relative rounded-[14px] overflow-hidden bg-white/5 border border-ink/8 dark:border-white/10 checkerboard aspect-square md:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={processedFile.originalUrl} alt="Original" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-grey mb-3 uppercase tracking-wider">Removed Background</h4>
            <div className="relative rounded-[14px] overflow-hidden bg-white/5 border border-ink/8 dark:border-white/10 checkerboard aspect-square md:aspect-auto" style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={processedFile.resultUrl} alt="Result" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-2xl bg-paper border border-ink/8 dark:border-white/10 rounded-[16px] shadow-soft dark:shadow-soft-dark p-6 mb-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-ink mb-2">Background Color</h4>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setBgColor("transparent")}
                className={clsx(
                  "w-8 h-8 rounded-full border checkerboard flex items-center justify-center", 
                  bgColor === "transparent" ? "ring-2 ring-sel border-transparent" : "border-ink/20"
                )}
                title="Transparent"
              />
              <button onClick={() => setBgColor("#ffffff")} className={clsx("w-8 h-8 rounded-full bg-white border", bgColor === "#ffffff" ? "ring-2 ring-sel border-transparent" : "border-ink/20")} />
              <button onClick={() => setBgColor("#000000")} className={clsx("w-8 h-8 rounded-full bg-black border", bgColor === "#000000" ? "ring-2 ring-sel border-transparent" : "border-ink/20")} />
              <input 
                type="color" 
                value={bgColor === 'transparent' ? '#ffffff' : bgColor} 
                onChange={e => setBgColor(e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer p-0"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow text-[#111212] font-medium rounded-[10px] shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-ink/8 dark:border-white/10 text-ink font-medium rounded-[9px] hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
        >
          Remove another background
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-[14px] p-10 flex flex-col items-center justify-center text-center transition-all tool-interaction-zone",
          isDragActive
            ? "border-ink/40 dark:border-white/40 bg-ink/[0.03] dark:bg-white/[0.03]"
            : "border-ink/15 dark:border-white/15 hover:border-ink/25 dark:hover:border-white/25 hover:bg-ink/[0.015] dark:hover:bg-white/[0.02]"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className={clsx("w-12 h-12 mb-4", isDragActive ? "text-yellow" : "text-grey/60")} />
        <h3 className="text-lg font-medium text-ink mb-2">
          {isDragActive ? "Drop image here..." : "Drag & drop an image here"}
        </h3>
        <p className="text-grey text-sm mb-6">Supports JPG, PNG, and WEBP</p>
        
        <button
          type="button"
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              open();
            }
          }}
          className="mt-2 px-5 py-2.5 bg-ink text-paper rounded-[9px] text-[13.5px] font-medium shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all"
        >
          Browse files
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-3 p-4 bg-pink/10 border border-pink/20 rounded-[14px] text-pink">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {file && (
        <div className="animate-reveal-result bg-paper border border-ink/8 dark:border-white/10 rounded-[16px] shadow-soft dark:shadow-soft-dark p-6 space-y-6">
          <div className="bg-bg rounded-[14px] border border-ink/8 dark:border-white/10 overflow-hidden">
            <div className="p-4 border-b border-ink/8 dark:border-white/10 bg-paper flex justify-between items-center">
              <span className="font-medium text-ink">1 image selected</span>
            </div>
            <ul className="divide-y divide-white/10">
              <FileListItem 
                file={file} 
                index={0} 
                totalFiles={1} 
                onRemove={removeSelectedFile} 
              />
            </ul>
          </div>

          {(status === 'loading_model' || status === 'processing') && (
            <div className="bg-cyan/10 border border-cyan/20 rounded-[14px] p-4 flex flex-col items-center justify-center text-center text-cyan">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="font-medium">
                {status === 'loading_model' ? (downloadProgress || "Downloading AI model (~40MB, one-time)...") : "Removing background (running locally)..."}
              </p>
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={status === 'loading_model' || status === 'processing'}
            className={clsx(
              "w-full flex items-center justify-center gap-2 py-4 rounded-[10px] font-medium text-lg transition-all",
              (status === 'loading_model' || status === 'processing')
                ? "bg-ink/5 text-grey/60 cursor-not-allowed"
                : "bg-yellow text-[#111212] hover:bg-yellow/90 shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover"
            )}
          >
            {(status === 'loading_model' || status === 'processing') ? (
              "Processing..."
            ) : (
              "Remove Background"
            )}
          </button>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .checkerboard {
          background-image: 
            linear-gradient(45deg, #ccc 25%, transparent 25%), 
            linear-gradient(-45deg, #ccc 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #ccc 75%), 
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .dark .checkerboard {
          background-image: 
            linear-gradient(45deg, #333 25%, transparent 25%), 
            linear-gradient(-45deg, #333 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #333 75%), 
            linear-gradient(-45deg, transparent 75%, #333 75%);
        }
      `}} />
    </div>
  );
}
