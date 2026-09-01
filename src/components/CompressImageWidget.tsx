"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { 
  UploadCloud, CheckCircle2, Loader2, AlertCircle, Download
} from "lucide-react";
import clsx from "clsx";
import { formatBytes } from "@/lib/utils";
import { FileListItem } from "./FileListItem";
import { fileToImage, processImage } from "@/lib/image-utils";

interface ProcessedFile {
  originalFile: File;
  blob: Blob;
  percentSaved: number;
}

export function CompressImageWidget() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [convertPng, setConvertPng] = useState<boolean>(true);
  
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [downloadZipUrl, setDownloadZipUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only JPG, PNG, and WEBP images are supported.");
    } else {
      setErrorMsg(null);
    }
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

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

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setStatus('processing');
    setErrorMsg(null);
    
    // Give UI time to update
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const results: ProcessedFile[] = [];
      
      for (const file of files) {
        const img = await fileToImage(file);
        
        let targetMime = file.type;
        if (file.type === 'image/png' && convertPng) {
          targetMime = 'image/webp';
        }

        const blob = await processImage(img, img.width, img.height, {
          mimeType: targetMime,
          quality: quality / 100,
          fillWhiteBackground: targetMime === 'image/jpeg'
        });
        
        const reduction = 1 - (blob.size / file.size);
        results.push({
          originalFile: file,
          blob,
          percentSaved: Math.max(0, Math.round(reduction * 100))
        });
      }
      
      setProcessedFiles(results);
      
      if (results.length > 1) {
        const zip = new JSZip();
        results.forEach(res => {
          const extension = res.blob.type === 'image/webp' ? '.webp' : 
                            res.blob.type === 'image/png' ? '.png' : '.jpg';
          const name = res.originalFile.name.replace(/\.[^/.]+$/, "") + "-compressed" + extension;
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
        setErrorMsg("An error occurred during compression.");
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
      <div className="flex flex-col items-center justify-center p-8 bg-surface border border-success/20 rounded-lg">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-textPrimary mb-6 text-center">Compressed Successfully!</h3>
        
        <div className="w-full max-w-2xl bg-background rounded-lg border border-white/10 overflow-hidden mb-8">
          <ul className="divide-y divide-white/10">
            {processedFiles.map((res, i) => {
              const url = URL.createObjectURL(res.blob);
              const extension = res.blob.type === 'image/webp' ? '.webp' : 
                                res.blob.type === 'image/png' ? '.png' : '.jpg';
              const name = res.originalFile.name.replace(/\.[^/.]+$/, "") + "-compressed" + extension;
              return (
                <li key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-textPrimary truncate">{name}</p>
                    <p className="text-xs text-textSecondary">
                      {formatBytes(res.originalFile.size)} → {formatBytes(res.blob.size)} 
                      <span className="text-success ml-2">({res.percentSaved}% saved)</span>
                    </p>
                  </div>
                  <a
                    href={url}
                    download={name}
                    className="shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-textPrimary transition-colors"
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
              download="compressed-images.zip"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-button hover:bg-accent/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download all as ZIP
            </a>
          )}
          <button
            onClick={handleReset}
            className={clsx(
              "flex items-center justify-center gap-2 px-6 py-3 border font-medium rounded-button transition-colors",
              processedFiles.length > 1 
                ? "bg-background border-white/10 text-textPrimary hover:bg-white/5" 
                : "bg-accent border-accent text-background hover:bg-accent/90"
            )}
          >
            Compress more images
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
          "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors duration-200",
          isDragActive ? "border-accent bg-accent/5" : "border-white/20 bg-background/50 hover:border-white/30"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className={clsx("w-12 h-12 mb-4", isDragActive ? "text-accent" : "text-textMuted")} />
        <h3 className="text-lg font-medium text-textPrimary mb-2">
          {isDragActive ? "Drop images here..." : "Drag & drop your images here"}
        </h3>
        <p className="text-textSecondary text-sm mb-6">Supports JPG, PNG, and WEBP</p>
        
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

      {errorMsg && (
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-surface border border-white/10 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Quality: {quality}%
            </label>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={quality} 
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full accent-accent"
            />
            <p className="text-xs text-textSecondary mt-1">Lower quality means smaller file size.</p>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={convertPng}
                onChange={(e) => setConvertPng(e.target.checked)}
                className="mt-1 accent-accent"
              />
              <div>
                <span className="block text-sm font-medium text-textPrimary">Convert PNG to WEBP</span>
                <span className="block text-xs text-textSecondary mt-0.5">PNG compression is lossless and won&apos;t shrink much. Convert to WEBP for massive size reductions.</span>
              </div>
            </label>
          </div>

          <div className="bg-background rounded-lg border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-surface flex justify-between items-center">
              <span className="font-medium text-textPrimary">{files.length} images selected</span>
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
            onClick={handleCompress}
            disabled={status === 'processing'}
            className={clsx(
              "w-full flex items-center justify-center gap-2 py-4 rounded-button font-medium text-lg transition-all",
              status === 'processing'
                ? "bg-white/5 text-textMuted cursor-not-allowed"
                : "bg-accent text-background hover:bg-accent/90 shadow-[0_0_20px_rgba(245,166,35,0.2)]"
            )}
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Compressing...
              </>
            ) : (
              "Compress Images"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
