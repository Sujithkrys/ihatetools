"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { Info, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

interface PdfMetadata {
  pageCount: number;
  fileSize: number;
  pdfVersion: string;
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creationDate?: string;
  modificationDate?: string;
}

export function PdfInfoWidget() {
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);
      setErrorMsg("");
      setMetadata(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Extract PDF version from the first bytes
        const uint8 = new Uint8Array(arrayBuffer.slice(0, 10));
        const textDecoder = new TextDecoder("utf-8");
        const headerStr = textDecoder.decode(uint8);
        const versionMatch = headerStr.match(/%PDF-(\d+\.\d+)/);
        const pdfVersion = versionMatch ? versionMatch[1] : "Unknown";

        const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
        
        setMetadata({
          pageCount: pdfDoc.getPageCount(),
          fileSize: file.size,
          pdfVersion,
          title: pdfDoc.getTitle() || "Not set",
          author: pdfDoc.getAuthor() || "Not set",
          subject: pdfDoc.getSubject() || "Not set",
          keywords: pdfDoc.getKeywords() || "Not set",
          creationDate: pdfDoc.getCreationDate() ? pdfDoc.getCreationDate()?.toLocaleString() : "Not set",
          modificationDate: pdfDoc.getModificationDate() ? pdfDoc.getModificationDate()?.toLocaleString() : "Not set",
        });

      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setErrorMsg(err.message || "An error occurred while reading the PDF.");
        } else {
          setErrorMsg("An error occurred while reading the PDF. It might be password protected.");
        }
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleReset = () => {
    setMetadata(null);
    setErrorMsg("");
    setFileName("");
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolWidgetShell>
      {!metadata && (
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors tool-interaction-zone",
              isDragActive ? "border-accent bg-accent/5" : "border-overlay/10 hover:border-overlay/20 hover:bg-surfaceHover",
              errorMsg ? "border-error/50 bg-error/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-surface">
                <Info className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop your PDF here</p>
                <p className="text-sm text-textSecondary mt-1">to view its hidden properties</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-surface border border-overlay/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {metadata && (
        <div className="bg-surface rounded-lg border border-overlay/5 p-4 sm:p-8 space-y-8">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-accent" />
              <div>
                <h3 className="text-xl font-medium text-textPrimary">{fileName}</h3>
                <p className="text-sm text-textSecondary">Document Properties</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors px-3 py-1 bg-overlay/5 rounded-md hover:bg-overlay/10"
            >
              Analyze another
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-overlay/5">
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">File Size</p>
              <p className="text-base text-textPrimary">{formatSize(metadata.fileSize)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Page Count</p>
              <p className="text-base text-textPrimary">{metadata.pageCount} Pages</p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">PDF Version</p>
              <p className="text-base text-textPrimary">{metadata.pdfVersion}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-overlay/5">
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Title</p>
              <p className="text-base text-textPrimary break-words">{metadata.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Author</p>
              <p className="text-base text-textPrimary break-words">{metadata.author}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Subject</p>
              <p className="text-base text-textPrimary break-words">{metadata.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Keywords</p>
              <p className="text-base text-textPrimary break-words">{metadata.keywords}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Created</p>
              <p className="text-base text-textPrimary">{metadata.creationDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Modified</p>
              <p className="text-base text-textPrimary">{metadata.modificationDate}</p>
            </div>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
