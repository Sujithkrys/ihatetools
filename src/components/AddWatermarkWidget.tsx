"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2 } from "lucide-react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function AddWatermarkWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");

  const [watermarkText, setWatermarkText] = useState("");
  const [opacity, setOpacity] = useState(30); // 10 to 80

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
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to read PDF.");
      setFile(null);
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

  const handleApplyWatermark = async () => {
    if (!originalPdfBytes || !watermarkText.trim()) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        // Simple sizing/positioning logic for a diagonal watermark
        // In a production app, we'd measure text width with font.widthOfTextAtSize
        const fontSize = 60;
        
        page.drawText(watermarkText, {
          x: width / 2 - 100, // roughly center left
          y: height / 2 - 50, // roughly center bottom
          size: fontSize,
          opacity: opacity / 100,
          color: rgb(0, 0, 0),
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadFilename(`watermarked-${file?.name || 'document.pdf'}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while applying the watermark.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setOriginalPdfBytes(null);
    setDownloadUrl(null);
    setErrorMsg("");
    setWatermarkText("");
    setOpacity(30);
  };

  return (
    <ToolWidgetShell>
      {!file && !isProcessing && (
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
              <Download className="w-8 h-8 text-grey" />
            </div>
            <div>
              <p className="text-lg font-medium text-ink">Drag & drop your PDF here</p>
              <p className="text-sm text-grey mt-1">or select it from your device</p>
            </div>
            <button className="mt-4 px-6 py-2 bg-paper border border-ink/15 rounded-md text-ink hover:bg-paperHover transition-colors font-medium">
              Browse files
            </button>
            {errorMsg && <p className="text-error text-sm mt-2">{errorMsg}</p>}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-yellow animate-spin mb-4" />
          <p className="text-ink font-medium">Processing...</p>
        </div>
      )}

      {file && !isProcessing && !downloadUrl && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
            <div>
              <h3 className="text-lg font-medium text-ink">{file.name}</h3>
              <p className="text-sm text-grey">Configure your watermark below.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-paper border border-ink/15 rounded-md text-ink hover:bg-paperHover transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyWatermark}
                disabled={!watermarkText.trim()}
                className="px-4 py-2 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Watermark
              </button>
            </div>
          </div>
          
          {errorMsg && <p className="text-error text-sm">{errorMsg}</p>}

          <div className="space-y-6 max-w-md mx-auto">
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-2">Watermark Text</span>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g., CONFIDENTIAL"
                className="block w-full px-3 py-2 border border-ink/15 rounded-md leading-5 bg-paper text-ink placeholder-textMuted focus:outline-none focus:ring-1 focus:ring-sel focus:border-sel sm:text-sm transition-all"
              />
            </label>

            <label className="block">
              <div className="flex justify-between items-center mb-2">
                <span className="block text-sm font-medium text-ink">Opacity</span>
                <span className="text-sm text-grey">{opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full accent-accent"
              />
            </label>
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <Download className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">Watermark Applied!</h3>
            <p className="text-grey mt-2">Your document has been successfully stamped.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-grey hover:text-ink underline underline-offset-4 text-sm mt-4"
          >
            Watermark another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
