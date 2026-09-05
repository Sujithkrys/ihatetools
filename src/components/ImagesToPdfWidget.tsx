"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function ImagesToPdfWidget() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only JPG and PNG images are supported.");
    } else {
      setErrorMsg("");
    }

    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGeneratePdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let embeddedImage;

        if (file.type === "image/jpeg") {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        const { width, height } = embeddedImage;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadFilename(`images-${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while generating the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadUrl(null);
    setErrorMsg("");
  };

  return (
    <ToolWidgetShell>
      {!downloadUrl && !isProcessing && (
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors tool-interaction-zone",
              isDragActive ? "border-accent bg-accent/5" : "border-overlay/10 hover:border-overlay/20 hover:bg-surfaceHover",
              errorMsg && files.length === 0 ? "border-error/50 bg-error/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-surface">
                <Download className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop images here</p>
                <p className="text-sm text-textSecondary mt-1">JPG or PNG</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-surface border border-overlay/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>

          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}

          {files.length > 0 && (
            <div className="animate-reveal-result bg-surface rounded-lg border border-overlay/5 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-textPrimary font-medium">{files.length} image{files.length !== 1 ? 's' : ''} added</h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-transparent text-textSecondary hover:text-textPrimary transition-colors text-sm font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleGeneratePdf}
                    className="px-4 py-2 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-sm"
                  >
                    Generate PDF
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {files.map((file, index) => (
                  <FileListItem
                    key={`${file.name}-${index}`}
                    file={file}
                    index={index}
                    totalFiles={files.length}
                    onMove={(idx, dir) => dir === 'up' ? handleMoveUp(idx) : handleMoveDown(idx)}
                    showMoveControls={true}
                    onRemove={() => handleRemove(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-textPrimary font-medium">Generating PDF...</p>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <Download className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-textPrimary">PDF Generated Successfully!</h3>
            <p className="text-textSecondary mt-2">Your images have been combined into a single PDF.</p>
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
            Create another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
