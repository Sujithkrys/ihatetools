"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import { Trash2, RotateCw, Download, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { generatePdfThumbnails } from "@/lib/pdf-render-utils";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";


interface PageItem {
  id: string; // unique id for rendering keys
  origIndex: number; // 0-based index in the original PDF
  rotation: number; // 0, 90, 180, 270 (relative to original)
  thumbnail: string; // base64 data url
}

export function OrganizePdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only PDF files are supported.");
      return;
    }
    if (acceptedFiles.length === 0) return;

    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setErrorMsg("");
    setDownloadUrl(null);
    setIsProcessing(true);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      setOriginalPdfBytes(arrayBuffer);

      const rawThumbnails = await generatePdfThumbnails(uploadedFile, {
        targetWidth: 200,
        quality: 0.8,
      });

      const pageItems: PageItem[] = rawThumbnails.map((thumb) => ({
        ...thumb,
        rotation: 0,
      }));

      setPages(pageItems);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to read PDF. The file may be password protected/corrupted, or your browser/ad-blocker is blocking the required PDF engine from loading.");
      setFile(null);
      setOriginalPdfBytes(null);
      setPages([]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleRotate = (index: number) => {
    setPages((prev) => {
      const next = [...prev];
      next[index].rotation = (next[index].rotation + 90) % 360;
      return next;
    });
  };

  const handleDelete = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    setPages((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveRight = (index: number) => {
    if (index === pages.length - 1) return;
    setPages((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleSave = async () => {
    if (!originalPdfBytes || pages.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const newPdf = await PDFDocument.create();

      const pageIndices = pages.map((p) => p.origIndex);
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);

      copiedPages.forEach((page, idx) => {
        const addedRotation = pages[idx].rotation;
        if (addedRotation !== 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + addedRotation));
        }
        newPdf.addPage(page);
      });

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save organized PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setOriginalPdfBytes(null);
    setPages([]);
    setDownloadUrl(null);
    setErrorMsg("");
  };

  return (
    <ToolWidgetShell>
      {!file && !isProcessing && (
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
              <Download className="w-8 h-8 text-textSecondary" />
            </div>
            <div>
              <p className="text-lg font-medium text-textPrimary">Drag & drop your PDF here</p>
              <p className="text-sm text-textSecondary mt-1">or select it from your device</p>
            </div>
            <button className="mt-4 px-6 py-2 bg-surface border border-white/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
              Browse files
            </button>
            {errorMsg && <p className="text-error text-sm mt-2">{errorMsg}</p>}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-textPrimary font-medium">Processing PDF...</p>
          <p className="text-sm text-textSecondary mt-2">This may take a moment for large files.</p>
        </div>
      )}

      {file && !isProcessing && !downloadUrl && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-textPrimary">{file.name}</h3>
              <p className="text-sm text-textSecondary">{pages.length} pages</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-surface border border-white/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={pages.length === 0}
                className="px-4 py-2 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
          
          {errorMsg && <p className="text-error text-sm">{errorMsg}</p>}

          <div className="bg-surface p-6 rounded-lg border border-white/5">
            {pages.length === 0 ? (
              <p className="text-center text-textSecondary py-8">All pages deleted. You must keep at least one page to save.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((page, idx) => (
                  <div key={page.id} className="relative group bg-background border border-white/10 rounded-md p-2 flex flex-col items-center">
                    <span className="absolute top-2 left-2 bg-surface/80 backdrop-blur-sm text-xs font-medium px-1.5 py-0.5 rounded text-textPrimary z-10">
                      {idx + 1}
                    </span>
                    
                    <div className="w-full aspect-[1/1.414] mb-3 relative overflow-hidden bg-white/5 flex items-center justify-center">
                      {/* Using img tag with transform for preview rotation */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={page.thumbnail} 
                        alt={`Page ${idx + 1}`}
                        className="max-w-full max-h-full object-contain transition-transform duration-300"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                    </div>

                    <div className="flex gap-1 justify-center w-full">
                      <button onClick={() => handleMoveLeft(idx)} disabled={idx === 0} className="p-1.5 text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded disabled:opacity-30 disabled:hover:bg-transparent" title="Move Left">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRotate(idx)} className="p-1.5 text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded" title="Rotate 90°">
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(idx)} className="p-1.5 text-error/80 hover:text-error hover:bg-error/10 rounded" title="Delete Page">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleMoveRight(idx)} disabled={idx === pages.length - 1} className="p-1.5 text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded disabled:opacity-30 disabled:hover:bg-transparent" title="Move Right">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <Download className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-textPrimary">Your PDF is ready!</h3>
            <p className="text-textSecondary mt-2">The document has been reorganized successfully.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={`organized-${file?.name || 'document.pdf'}`}
              className="px-8 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-textSecondary hover:text-textPrimary underline underline-offset-4 text-sm mt-4"
          >
            Organize another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
