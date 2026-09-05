"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { 
  UploadCloud, File as FileIcon, X, ArrowUp, ArrowDown, 
  CheckCircle2, Loader2, AlertCircle, Download
} from "lucide-react";
import clsx from "clsx";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function PdfMergeWidget() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'merging' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only PDF files are supported.");
      return;
    }
    setErrorMsg(null);
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    noClick: true,
    noKeyboard: true,
  });

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    } else if (direction === 'down' && index < newFiles.length - 1) {
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    }
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setStatus('merging');
    setErrorMsg(null);
    
    // Use a small timeout to allow UI to update to 'merging' state
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
          });
        } catch {
          throw new Error(`[${file.name}] appears to be password-protected or corrupted and can't be merged. Remove it and try again.`);
        }
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setMergedPdfUrl(url);
      setMergedSize(formatBytes(blob.size));
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An error occurred during merging.");
      }
      setStatus('idle');
    }
  };

  const handleReset = () => {
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    setFiles([]);
    setMergedPdfUrl(null);
    setMergedSize(null);
    setErrorMsg(null);
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-paper border border-success/20 rounded-lg text-center">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-ink mb-2">Merged Successfully!</h3>
        <p className="text-grey mb-8">Your files have been merged into a single document ({mergedSize}).</p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href={mergedPdfUrl!}
            download="merged.pdf"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow text-background font-medium rounded-[8px] hover:bg-yellow/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download merged PDF
          </a>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-bg border border-ink/15 text-ink font-medium rounded-[8px] hover:bg-ink/5 transition-colors"
          >
            Merge more files
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
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
          {isDragActive ? "Drop PDFs here..." : "Drag & drop your PDFs here"}
        </h3>
        <p className="text-grey text-sm mb-6">or select them from your device</p>
        
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
          aria-label="Browse files"
        >
          Browse files
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-bg rounded-lg border border-ink/15 overflow-hidden">
          <div className="p-4 border-b border-ink/15 bg-paper flex justify-between items-center">
            <span className="font-medium text-ink">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <ul className="divide-y divide-white/10 max-h-[400px] overflow-y-auto">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <FileIcon className="w-8 h-8 text-grey/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{file.name}</p>
                  <p className="text-xs text-grey">{formatBytes(file.size)}</p>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0}
                    className="p-2 text-grey/60 hover:text-ink disabled:opacity-30 disabled:hover:text-grey/60 transition-colors rounded"
                    aria-label="Move file up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-2 text-grey/60 hover:text-ink disabled:opacity-30 disabled:hover:text-grey/60 transition-colors rounded"
                    aria-label="Move file down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-grey/60 hover:text-error transition-colors rounded ml-2"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Merge Action */}
      <button
        onClick={handleMerge}
        disabled={files.length < 2 || status === 'merging'}
        className={clsx(
          "w-full flex items-center justify-center gap-2 py-4 rounded-[8px] font-medium text-lg transition-all",
          files.length < 2 || status === 'merging'
            ? "bg-ink/5 text-grey/60 cursor-not-allowed"
            : "bg-yellow text-background hover:bg-yellow/90 shadow-[0_0_20px_rgba(245,166,35,0.2)]"
        )}
      >
        {status === 'merging' ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Merging PDFs...
          </>
        ) : (
          "Merge PDFs"
        )}
      </button>
    </div>
  );
}
