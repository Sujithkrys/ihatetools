"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { 
  UploadCloud, CheckCircle2, Loader2, AlertCircle, Download, Link as LinkIcon, Unlink
} from "lucide-react";
import clsx from "clsx";
import { formatBytes } from "@/lib/utils";
import { FileListItem } from "./FileListItem";
import { fileToImage, processImage } from "@/lib/image-utils";

interface ProcessedFile {
  originalFile: File;
  blob: Blob;
  width: number;
  height: number;
}

export function ResizeImageWidget() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [downloadZipUrl, setDownloadZipUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only JPG, PNG, and WEBP images are supported.");
    } else {
      setErrorMsg(null);
    }
    
    setFiles(prev => [...prev, ...acceptedFiles]);
    
    // Automatically set dimensions based on the first dropped image if none set
    if (acceptedFiles.length > 0 && width === 0 && height === 0) {
      try {
        const img = await fileToImage(acceptedFiles[0]);
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      } catch {
        // ignore
      }
    }
  }, [width, height]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && originalRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && originalRatio) {
      setWidth(Math.round(val * originalRatio));
    }
  };

  const handleResize = async () => {
    if (files.length === 0) return;
    if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
      setErrorMsg("Please enter valid width and height dimensions.");
      return;
    }
    
    setStatus('processing');
    setErrorMsg(null);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const results: ProcessedFile[] = [];
      
      for (const file of files) {
        const img = await fileToImage(file);
        
        const targetW = width;
        const targetH = height;
        
        // If aspect ratio is locked and dealing with batch, 
        // normally we should apply the ratio of the FIRST image to all, or per-image. 
        // The prompt says "based on the original image's ratio" for inputs.
        // We will just force all images to the explicit width/height typed in the box.
        
        const blob = await processImage(img, targetW, targetH, {
          mimeType: file.type,
          quality: 0.9,
          fillWhiteBackground: false
        });
        
        results.push({
          originalFile: file,
          blob,
          width: targetW,
          height: targetH
        });
      }
      
      setProcessedFiles(results);
      
      if (results.length > 1) {
        const zip = new JSZip();
        results.forEach(res => {
          const name = res.originalFile.name.replace(/\.[^/.]+$/, "") + "-resized" + res.originalFile.name.match(/\.[^/.]+$/)?.[0];
          zip.file(name, res.blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setDownloadZipUrl(URL.createObjectURL(zipBlob));
      }
      
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An error occurred during resizing.");
      }
      setStatus('idle');
    }
  };

  const handleReset = () => {
    if (downloadZipUrl) URL.revokeObjectURL(downloadZipUrl);
    setFiles([]);
    setProcessedFiles([]);
    setDownloadZipUrl(null);
    setErrorMsg(null);
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-paper border border-success/20 rounded-lg">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-ink mb-6 text-center">Resized Successfully!</h3>
        
        <div className="w-full max-w-2xl bg-bg rounded-lg border border-ink/15 overflow-hidden mb-8">
          <ul className="divide-y divide-white/10">
            {processedFiles.map((res, i) => {
              const url = URL.createObjectURL(res.blob);
              const name = res.originalFile.name.replace(/\.[^/.]+$/, "") + "-resized" + res.originalFile.name.match(/\.[^/.]+$/)?.[0];
              return (
                <li key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink truncate">{name}</p>
                    <p className="text-xs text-grey">
                      {res.width}x{res.height} • {formatBytes(res.blob.size)}
                    </p>
                  </div>
                  <a
                    href={url}
                    download={name}
                    className="shrink-0 px-4 py-2 bg-ink/5 hover:bg-overlay/10 border border-ink/15 rounded text-sm text-ink transition-colors"
                  >
                    Download
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {processedFiles.length > 1 && downloadZipUrl && (
            <a
              href={downloadZipUrl}
              download="resized-images.zip"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow text-background font-medium rounded-[8px] hover:bg-yellow/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download all as ZIP
            </a>
          )}
          <button
            onClick={handleReset}
            className={clsx(
              "flex items-center justify-center gap-2 px-6 py-3 border font-medium rounded-[8px] transition-colors",
              processedFiles.length > 1 
                ? "bg-bg border-ink/15 text-ink hover:bg-ink/5" 
                : "bg-yellow border-accent text-background hover:bg-yellow/90"
            )}
          >
            Resize more images
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors duration-200 tool-interaction-zone",
          isDragActive ? "border-accent bg-yellow/5" : "border-ink/25 bg-bg/50 hover:border-ink/30"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className={clsx("w-12 h-12 mb-4", isDragActive ? "text-yellow" : "text-grey/60")} />
        <h3 className="text-lg font-medium text-ink mb-2">
          {isDragActive ? "Drop images here..." : "Drag & drop your images here"}
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
          className="px-5 py-2.5 bg-paper border border-ink/15 rounded-[8px] text-ink font-medium hover:bg-paperHover hover:border-ink/25 transition-all focus:outline-none focus:ring-2 focus:ring-sel"
        >
          Browse files
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="animate-reveal-result bg-paper border border-ink/15 rounded-lg p-6 space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-ink mb-2">Width (px)</label>
              <input 
                type="number"
                value={width || ""}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-bg border border-ink/15 rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-sel"
              />
            </div>
            
            <button
              onClick={() => setLockAspect(!lockAspect)}
              className="p-2 mb-1 text-grey hover:text-ink transition-colors"
              title={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
            >
              {lockAspect ? <LinkIcon className="w-5 h-5" /> : <Unlink className="w-5 h-5" />}
            </button>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-ink mb-2">Height (px)</label>
              <input 
                type="number"
                value={height || ""}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-bg border border-ink/15 rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-sel"
              />
            </div>
          </div>

          <div className="bg-bg rounded-lg border border-ink/15 overflow-hidden">
            <div className="p-4 border-b border-ink/15 bg-paper flex justify-between items-center">
              <span className="font-medium text-ink">{files.length} images selected</span>
            </div>
            <ul className="divide-y divide-white/10 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <FileListItem 
                  key={`${file.name}-${index}`} 
                  file={file} 
                  index={index} 
                  totalFiles={files.length} 
                  onRemove={removeFile} 
                />
              ))}
            </ul>
          </div>

          <button
            onClick={handleResize}
            disabled={status === 'processing'}
            className={clsx(
              "w-full flex items-center justify-center gap-2 py-4 rounded-[8px] font-medium text-lg transition-all",
              status === 'processing'
                ? "bg-ink/5 text-grey/60 cursor-not-allowed"
                : "bg-yellow text-background hover:bg-yellow/90 shadow-[0_0_20px_rgba(245,166,35,0.2)]"
            )}
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Resizing...
              </>
            ) : (
              "Resize Images"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
