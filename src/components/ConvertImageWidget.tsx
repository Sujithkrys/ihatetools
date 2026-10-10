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
  targetFormat: string;
}

export function ConvertImageWidget() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  
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

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setStatus('processing');
    setErrorMsg(null);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const results: ProcessedFile[] = [];
      
      for (const file of files) {
        const img = await fileToImage(file);
        
        const blob = await processImage(img, img.width, img.height, {
          mimeType: targetFormat,
          quality: 0.92,
          fillWhiteBackground: targetFormat === 'image/jpeg'
        });
        
        results.push({
          originalFile: file,
          blob,
          targetFormat
        });
      }
      
      setProcessedFiles(results);
      
      if (results.length > 1) {
        const zip = new JSZip();
        results.forEach(res => {
          const extension = res.targetFormat === 'image/webp' ? '.webp' : 
                            res.targetFormat === 'image/png' ? '.png' : '.jpg';
          const name = res.originalFile.name.replace(/\.[^/.]+$/, "") + "-converted" + extension;
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
        setErrorMsg("An error occurred during conversion.");
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
      <div className="flex flex-col items-center justify-center p-8 bg-paper border border-sel/20 rounded-[16px] shadow-soft dark:shadow-soft-dark">
        <div className="w-16 h-16 bg-sel/10 text-sel rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-ink mb-6 text-center">Converted Successfully!</h3>

        <div className="w-full max-w-2xl bg-bg rounded-[16px] border border-ink/8 dark:border-white/10 overflow-hidden mb-8">
          <ul className="divide-y divide-white/10">
            {processedFiles.map((res, i) => {
              const url = URL.createObjectURL(res.blob);
              const extension = res.targetFormat === 'image/webp' ? '.webp' : 
                                res.targetFormat === 'image/png' ? '.png' : '.jpg';
              const name = res.originalFile.name.replace(/\.[^/.]+$/, "") + "-converted" + extension;
              return (
                <li key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink truncate">{name}</p>
                    <p className="text-xs text-grey">
                      {formatBytes(res.blob.size)}
                    </p>
                  </div>
                  <a
                    href={url}
                    download={name}
                    className="shrink-0 px-4 py-2 bg-ink/5 hover:bg-overlay/10 border border-ink/8 dark:border-white/10 rounded-[9px] text-sm text-ink transition-colors"
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
              download="converted-images.zip"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-ink text-paper font-medium rounded-[10px] hover:bg-ink/90 shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all"
            >
              <Download className="w-5 h-5" />
              Download all as ZIP
            </a>
          )}
          <button
            onClick={handleReset}
            className={clsx(
              "flex items-center justify-center gap-2 px-6 py-3 border font-medium rounded-[10px] shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all",
              processedFiles.length > 1
                ? "bg-bg border-ink/8 dark:border-white/10 text-ink hover:bg-ink/5"
                : "bg-ink border-ink/40 dark:border-white/40 text-paper hover:bg-ink/90"
            )}
          >
            Convert more images
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
          "border-2 border-dashed rounded-[14px] p-10 flex flex-col items-center justify-center text-center transition-all tool-interaction-zone",
          isDragActive
            ? "border-ink/40 dark:border-white/40 bg-ink/[0.03] dark:bg-white/[0.03]"
            : "border-ink/15 dark:border-white/15 hover:border-ink/25 dark:hover:border-white/25 hover:bg-ink/[0.015] dark:hover:bg-white/[0.02]"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className={clsx("w-12 h-12 mb-4", isDragActive ? "text-sel" : "text-grey/60")} />
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

      {files.length > 0 && (
        <div className="animate-reveal-result bg-paper border border-ink/8 dark:border-white/10 rounded-[16px] shadow-soft dark:shadow-soft-dark p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-ink mb-3">Target Format</label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'image/jpeg', label: 'JPG' },
                { id: 'image/png', label: 'PNG' },
                { id: 'image/webp', label: 'WEBP' }
              ].map(fmt => (
                <label key={fmt.id} className="flex items-center gap-2 cursor-pointer text-ink">
                  <input 
                    type="radio" 
                    name="targetFormat" 
                    value={fmt.id}
                    checked={targetFormat === fmt.id}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="accent-sel bg-bg border-ink/25"
                  />
                  {fmt.label}
                </label>
              ))}
            </div>
            {targetFormat === 'image/jpeg' && (
              <p className="text-xs text-grey mt-2">
                Note: When converting transparent images (like PNGs) to JPG, transparent areas will automatically be filled with white.
              </p>
            )}
          </div>

          <div className="bg-bg rounded-[16px] border border-ink/8 dark:border-white/10 overflow-hidden">
            <div className="p-4 border-b border-ink/8 dark:border-white/10 bg-paper flex justify-between items-center">
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
            onClick={handleConvert}
            disabled={status === 'processing'}
            className={clsx(
              "w-full flex items-center justify-center gap-2 py-4 rounded-[10px] font-medium text-lg shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all",
              status === 'processing'
                ? "bg-ink/5 text-grey/60 cursor-not-allowed"
                : "bg-ink text-paper hover:bg-ink/90 shadow-[0_0_20px_rgba(13,153,255,0.2)]"
            )}
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert Images"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
