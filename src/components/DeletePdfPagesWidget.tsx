"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { Download, Loader2, Trash2 } from "lucide-react";
import { generatePdfThumbnails, PdfPageThumbnail } from "@/lib/pdf-render-utils";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function DeletePdfPagesWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PdfPageThumbnail[]>([]);
  const [deletedIndices, setDeletedIndices] = useState<Set<number>>(new Set());
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid PDF file.");
    } else {
      setErrorMsg("");
    }

    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      setIsProcessing(true);
      setErrorMsg("");
      setDeletedIndices(new Set());

      try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        setOriginalPdfBytes(arrayBuffer);

        const rawThumbnails = await generatePdfThumbnails(uploadedFile, {
          targetWidth: 200,
          quality: 0.8,
        });

        setPages(rawThumbnails);
      } catch (err: unknown) {
        console.error(err);
        setFile(null);
        if (err instanceof Error) {
          setErrorMsg(err.message || "An error occurred while loading the PDF.");
        } else {
          setErrorMsg("An error occurred while loading the PDF. It might be password protected.");
        }
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const toggleDelete = (index: number) => {
    setDeletedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (!file || !originalPdfBytes || pages.length === 0) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const newPdf = await PDFDocument.create();

      const pageIndicesToKeep = pages
        .filter((_, i) => !deletedIndices.has(i))
        .map(p => p.origIndex);

      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndicesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFilename(`${baseName}-edited.pdf`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message || "An error occurred while deleting pages.");
      } else {
        setErrorMsg("An error occurred while deleting pages.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setOriginalPdfBytes(null);
    setPages([]);
    setDeletedIndices(new Set());
    setDownloadUrl(null);
    setErrorMsg("");
  };

  // True if all pages are selected for deletion
  const allDeleted = deletedIndices.size === pages.length && pages.length > 0;
  const isReady = file && pages.length > 0 && !allDeleted && deletedIndices.size > 0;

  return (
    <ToolWidgetShell>
      {!downloadUrl && !isProcessing && (
        <div className="space-y-6">
          {!file ? (
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
                  <Trash2 className="w-8 h-8 text-textSecondary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-textPrimary">Drag & drop your PDF here</p>
                  <p className="text-sm text-textSecondary mt-1">to remove pages</p>
                </div>
                <button className="mt-4 px-6 py-2 bg-surface border border-white/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
                  Browse files
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-white/5 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-textPrimary font-medium">Selected Document</h3>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
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

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-textSecondary">Select pages to delete</label>
                  <span className="text-sm text-textSecondary">{deletedIndices.size} selected</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto pr-2 pb-4">
                  {pages.map((page, idx) => {
                    const isDeleted = deletedIndices.has(idx);
                    return (
                      <div 
                        key={page.id} 
                        onClick={() => toggleDelete(idx)}
                        className={cn(
                          "relative group rounded-md p-2 flex flex-col items-center cursor-pointer transition-all border-2",
                          isDeleted ? "border-error bg-error/5" : "border-transparent bg-background hover:border-white/10"
                        )}
                      >
                        <span className="absolute top-2 left-2 bg-surface/80 backdrop-blur-sm text-xs font-medium px-1.5 py-0.5 rounded text-textPrimary z-10">
                          {idx + 1}
                        </span>
                        
                        <div className="w-full aspect-[1/1.414] relative overflow-hidden bg-white/5 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={page.thumbnail} 
                            alt={`Page ${idx + 1}`}
                            className={cn(
                              "max-w-full max-h-full object-contain transition-all",
                              isDeleted ? "opacity-30 grayscale" : "opacity-100"
                            )}
                          />
                          {isDeleted && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="bg-error/20 p-3 rounded-full">
                                <Trash2 className="w-8 h-8 text-error" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {allDeleted && (
                <p className="text-warning text-sm mt-4 text-center">You cannot delete every page in the document.</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDelete}
                  disabled={!isReady}
                  className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  Apply Deletion
                </button>
              </div>
            </div>
          )}

          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-textPrimary font-medium">Processing PDF...</p>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <Trash2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-textPrimary">Deletion Complete!</h3>
            <p className="text-textSecondary mt-2">The selected pages have been removed.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Updated PDF
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-textSecondary hover:text-textPrimary underline underline-offset-4 text-sm mt-4"
          >
            Edit another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
