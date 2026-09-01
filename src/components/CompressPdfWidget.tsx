"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { 
  UploadCloud, CheckCircle2, Loader2, AlertCircle, Download, Info
} from "lucide-react";
import clsx from "clsx";
import { formatBytes } from "@/lib/utils";
import { FileListItem } from "./FileListItem";

export function CompressPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
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
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // Save with useObjectStreams to compress structure
      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      
      const reduction = 1 - (blob.size / file.size);
      
      setNewSize(blob.size);
      setPercentSaved(Math.max(0, Math.round(reduction * 100)));
      
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(`"${file.name}" is password-protected or corrupted.`);
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
            <p>This PDF is already well-optimized — we couldn&apos;t reduce it further without degrading images (which requires re-encoding).</p>
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
    );
  }

  return (
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
            <FileListItem file={file} index={0} totalFiles={1} onRemove={() => setFile(null)} />
          </ul>
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
            "w-full flex items-center justify-center gap-2 py-4 rounded-button font-medium text-lg transition-all",
            status === 'processing'
              ? "bg-white/5 text-textMuted cursor-not-allowed"
              : "bg-accent text-background hover:bg-accent/90 shadow-[0_0_20px_rgba(245,166,35,0.2)]"
          )}
        >
          {status === 'processing' ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Compressing PDF...
            </>
          ) : (
            "Compress PDF"
          )}
        </button>
      )}
    </div>
  );
}
