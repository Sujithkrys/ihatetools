"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { 
  UploadCloud, CheckCircle2, Loader2, AlertCircle, Download
} from "lucide-react";
import clsx from "clsx";
import { formatBytes } from "@/lib/utils";
import { FileListItem } from "./FileListItem";

export function SplitPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);
  const [downloadSize, setDownloadSize] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'range' | 'individual'>('individual');
  const [rangeInput, setRangeInput] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only PDF files are supported.");
      return;
    }
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;
    
    setErrorMsg(null);
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
      setFile(uploadedFile);
    } catch {
      setErrorMsg(`"${uploadedFile.name}" appears to be password-protected or corrupted. Please try another file.`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const parseRange = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
          throw new Error(`Invalid range: ${part}. Pages must be between 1 and ${maxPages}.`);
        }
        for (let i = start; i <= end; i++) pages.add(i);
      } else {
        const pageNum = parseInt(part, 10);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > maxPages) {
          throw new Error(`Invalid page: ${part}. Pages must be between 1 and ${maxPages}.`);
        }
        pages.add(pageNum);
      }
    }
    
    if (pages.size === 0) throw new Error("Please specify at least one page.");
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    
    setStatus('processing');
    setErrorMsg(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      let finalBlob: Blob;
      let finalName: string;

      if (mode === 'range') {
        const pagesToExtract = parseRange(rangeInput, pageCount);
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, pagesToExtract.map(p => p - 1));
        copiedPages.forEach(p => newPdf.addPage(p));
        
        const pdfBytes = await newPdf.save();
        finalBlob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
        finalName = file.name.replace('.pdf', '-extracted.pdf');
      } else {
        // Individual
        if (pageCount === 1) {
          finalBlob = file;
          finalName = file.name;
        } else {
          const zip = new JSZip();
          for (let i = 0; i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(pdf, [i]);
            newPdf.addPage(copiedPage);
            const pdfBytes = await newPdf.save();
            zip.file(`${file.name.replace('.pdf', '')}-page-${i + 1}.pdf`, pdfBytes);
          }
          finalBlob = await zip.generateAsync({ type: 'blob' });
          finalName = file.name.replace('.pdf', '-pages.zip');
        }
      }

      const url = URL.createObjectURL(finalBlob);
      setDownloadUrl(url);
      setDownloadName(finalName);
      setDownloadSize(formatBytes(finalBlob.size));
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An error occurred during splitting.");
      }
      setStatus('idle');
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setPageCount(0);
    setDownloadUrl(null);
    setDownloadName(null);
    setDownloadSize(null);
    setErrorMsg(null);
    setStatus('idle');
    setRangeInput("");
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface border border-success/20 rounded-lg text-center">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-textPrimary mb-2">Split Successfully!</h3>
        <p className="text-textSecondary mb-8">Your file is ready to download ({downloadSize}).</p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href={downloadUrl!}
            download={downloadName!}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-button hover:bg-accent/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download {downloadName?.endsWith('.zip') ? 'ZIP' : 'PDF'}
          </a>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-background border border-white/10 text-textPrimary font-medium rounded-button hover:bg-white/5 transition-colors"
          >
            Split another file
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
            <span className="font-medium text-textPrimary">1 file selected ({pageCount} pages)</span>
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
        <div className="bg-surface border border-white/10 rounded-lg p-6 space-y-6">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-textPrimary cursor-pointer">
              <input 
                type="radio" 
                name="mode" 
                checked={mode === 'individual'} 
                onChange={() => setMode('individual')}
                className="text-accent focus:ring-accent bg-background border-white/20"
              />
              Split into individual pages
            </label>
            <label className="flex items-center gap-2 text-textPrimary cursor-pointer">
              <input 
                type="radio" 
                name="mode" 
                checked={mode === 'range'} 
                onChange={() => setMode('range')}
                className="text-accent focus:ring-accent bg-background border-white/20"
              />
              Extract page range
            </label>
          </div>

          {mode === 'range' && (
            <div>
              <label htmlFor="rangeInput" className="block text-sm text-textSecondary mb-2">
                Pages to extract (e.g., 1-5, 8, 11-13)
              </label>
              <input
                id="rangeInput"
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder={`1-${pageCount}`}
                className="w-full px-4 py-2 bg-background border border-white/10 rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>
          )}

          <button
            onClick={handleSplit}
            disabled={status === 'processing' || (mode === 'range' && !rangeInput)}
            className={clsx(
              "w-full flex items-center justify-center gap-2 py-4 rounded-button font-medium text-lg transition-all",
              status === 'processing' || (mode === 'range' && !rangeInput)
                ? "bg-white/5 text-textMuted cursor-not-allowed"
                : "bg-accent text-background hover:bg-accent/90 shadow-[0_0_20px_rgba(245,166,35,0.2)]"
            )}
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Splitting PDF...
              </>
            ) : (
              "Split PDF"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
