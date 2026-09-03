"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { Download, Loader2, Tags } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function PdfMetadataWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");

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
      
      try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        setOriginalPdfBytes(arrayBuffer);
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        setTitle(pdfDoc.getTitle() || "");
        setAuthor(pdfDoc.getAuthor() || "");
        setSubject(pdfDoc.getSubject() || "");
        setKeywords(pdfDoc.getKeywords() || "");
      } catch (err: unknown) {
        console.error(err);
        setFile(null);
        setOriginalPdfBytes(null);
        if (err instanceof Error) {
          setErrorMsg(err.message || "An error occurred while reading the PDF.");
        } else {
          setErrorMsg("An error occurred while reading the PDF. It might be password protected.");
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

  const handleApply = async () => {
    if (!file || !originalPdfBytes) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      
      pdfDoc.setTitle(title);
      pdfDoc.setAuthor(author);
      pdfDoc.setSubject(subject);
      pdfDoc.setKeywords(keywords.split(',').map(k => k.trim()));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFilename(`${baseName}-metadata.pdf`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message || "An error occurred while saving metadata.");
      } else {
        setErrorMsg("An error occurred while saving metadata.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setOriginalPdfBytes(null);
    setDownloadUrl(null);
    setErrorMsg("");
    setTitle("");
    setAuthor("");
    setSubject("");
    setKeywords("");
  };

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
                  <Tags className="w-8 h-8 text-textSecondary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-textPrimary">Drag & drop your PDF here</p>
                  <p className="text-sm text-textSecondary mt-1">to edit its metadata</p>
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
                  onClick={() => handleReset()}
                  className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
                >
                  Change file
                </button>
              </div>
              
              <FileListItem
                file={file}
                index={0}
                totalFiles={1}
                onRemove={() => handleReset()}
              />

              <div className="mt-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-md px-4 py-2 text-textPrimary focus:outline-none focus:border-accent"
                    placeholder="Document Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Author</label>
                  <input 
                    type="text" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-md px-4 py-2 text-textPrimary focus:outline-none focus:border-accent"
                    placeholder="Author Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-md px-4 py-2 text-textPrimary focus:outline-none focus:border-accent"
                    placeholder="Document Subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Keywords (comma separated)</label>
                  <input 
                    type="text" 
                    value={keywords} 
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-md px-4 py-2 text-textPrimary focus:outline-none focus:border-accent"
                    placeholder="e.g. invoice, 2024, confidential"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleApply}
                  className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2"
                >
                  <Tags className="w-5 h-5" />
                  Save Metadata
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
          <p className="text-textPrimary font-medium">Processing...</p>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <Tags className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-textPrimary">Metadata Saved!</h3>
            <p className="text-textSecondary mt-2">Your document properties have been successfully updated.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
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
            Edit another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
