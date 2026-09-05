"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import { Download, Loader2, RotateCw, RotateCcw, RefreshCw } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

type RotationAngle = 90 | -90 | 180;

export function RotatePdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");
  const [rotation, setRotation] = useState<RotationAngle>(90);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid PDF file.");
    } else {
      setErrorMsg("");
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        // pdf-lib handles angle normalization (0, 90, 180, 270, 360) internally via degrees()
        let newAngle = currentRotation + rotation;
        if (newAngle < 0) newAngle += 360;
        
        page.setRotation(degrees(newAngle));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFilename(`${baseName}-rotated.pdf`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message || "An error occurred while rotating the PDF.");
      } else {
        setErrorMsg("An error occurred while rotating the PDF. It might be password protected.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setErrorMsg("");
    setRotation(90);
  };

  return (
    <ToolWidgetShell>
      {!downloadUrl && !isProcessing && (
        <div className="space-y-6">
          {!file ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors tool-interaction-zone",
                isDragActive ? "border-accent bg-yellow/5" : "border-ink/15 hover:border-ink/25 hover:bg-paperHover",
                errorMsg ? "border-error/50 bg-error/5" : ""
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-paper">
                  <RotateCw className="w-8 h-8 text-grey" />
                </div>
                <div>
                  <p className="text-lg font-medium text-ink">Drag & drop your PDF here</p>
                  <p className="text-sm text-grey mt-1">to rotate all pages</p>
                </div>
                <button className="mt-4 px-6 py-2 bg-paper border border-ink/15 rounded-md text-ink hover:bg-paperHover transition-colors font-medium">
                  Browse files
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-paper rounded-lg border border-ink/10 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-ink font-medium">Selected Document</h3>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-grey hover:text-ink transition-colors"
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
                <label className="block text-sm font-medium text-grey mb-4">Select Rotation</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setRotation(90)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-lg border transition-colors",
                      rotation === 90 ? "bg-yellow/10 border-accent text-yellow" : "bg-bg border-ink/15 text-grey hover:border-ink/25 hover:text-ink"
                    )}
                  >
                    <RotateCw size={24} />
                    <span className="text-sm font-medium">90° Right</span>
                  </button>
                  <button
                    onClick={() => setRotation(-90)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-lg border transition-colors",
                      rotation === -90 ? "bg-yellow/10 border-accent text-yellow" : "bg-bg border-ink/15 text-grey hover:border-ink/25 hover:text-ink"
                    )}
                  >
                    <RotateCcw size={24} />
                    <span className="text-sm font-medium">90° Left</span>
                  </button>
                  <button
                    onClick={() => setRotation(180)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-lg border transition-colors",
                      rotation === 180 ? "bg-yellow/10 border-accent text-yellow" : "bg-bg border-ink/15 text-grey hover:border-ink/25 hover:text-ink"
                    )}
                  >
                    <RefreshCw size={24} />
                    <span className="text-sm font-medium">180° (Upside Down)</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleRotate}
                  className="px-6 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-base flex items-center gap-2"
                >
                  <RotateCw className="w-5 h-5" />
                  Apply Rotation
                </button>
              </div>
            </div>
          )}

          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-yellow animate-spin mb-4" />
          <p className="text-ink font-medium">Rotating PDF...</p>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <RotateCw className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">Rotation Complete!</h3>
            <p className="text-grey mt-2">All pages in your PDF have been rotated.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Rotated PDF
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-grey hover:text-ink underline underline-offset-4 text-sm mt-4"
          >
            Rotate another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
