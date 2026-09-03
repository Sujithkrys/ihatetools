"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, ScanText, Copy, Check } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export function OcrPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [extractedText, setExtractedText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid PDF or Image file.");
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
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxFiles: 1,
  });

  const runOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg("");
    setExtractedText("");
    setProgressPercent(0);
    setProgressMsg("Initializing OCR Engine...");

    try {
      const imageSources: string[] = [];
      const arrayBuffer = await file.arrayBuffer();

      if (file.type === "application/pdf") {
        setProgressMsg("Loading PDF document...");
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          setProgressMsg(`Rendering PDF page ${i} of ${totalPages}...`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // 2.0 scale for better OCR clarity
          
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not create canvas context");
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await page.render({ canvasContext: ctx, viewport } as any).promise;
          imageSources.push(canvas.toDataURL("image/jpeg", 0.9));
        }
      } else {
        // It's an image
        const blob = new Blob([arrayBuffer], { type: file.type });
        imageSources.push(URL.createObjectURL(blob));
      }

      let allText = "";
      for (let i = 0; i < imageSources.length; i++) {
        setProgressMsg(imageSources.length > 1 ? `Extracting text from page ${i + 1} of ${imageSources.length}...` : "Extracting text...");
        setProgressPercent(0);

        const result = await Tesseract.recognize(
          imageSources[i],
          'eng',
          {
            logger: (m) => {
              if (m.status === "recognizing text") {
                setProgressPercent(Math.round(m.progress * 100));
              }
            }
          }
        );
        
        allText += result.data.text + (imageSources.length > 1 ? "\n\n--- Page Break ---\n\n" : "");
      }

      setExtractedText(allText.trim());
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to extract text. The file might be corrupted, or your network blocked the OCR engine from loading.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedText("");
    setErrorMsg("");
  };

  return (
    <ToolWidgetShell>
      {!extractedText && !isProcessing && (
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
                  <ScanText className="w-8 h-8 text-textSecondary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-textPrimary">Drag & drop a PDF or Image here</p>
                  <p className="text-sm text-textSecondary mt-1">Works best with clear, high-resolution scans (English)</p>
                </div>
                <button className="mt-4 px-6 py-2 bg-surface border border-white/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
                  Browse files
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-white/5 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-textPrimary font-medium">Selected File</h3>
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

              <div className="mt-8 flex justify-end">
                <button
                  onClick={runOcr}
                  className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2"
                >
                  <ScanText className="w-5 h-5" />
                  Extract Text
                </button>
              </div>
            </div>
          )}

          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <div className="text-center w-full max-w-sm">
            <p className="text-textPrimary font-medium text-lg">{progressMsg}</p>
            <div className="w-full bg-background rounded-full h-2 mt-4 overflow-hidden border border-white/10">
              <div 
                className="bg-accent h-2 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-sm text-textSecondary mt-2">{progressPercent}% Complete</p>
          </div>
        </div>
      )}

      {extractedText && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-medium text-textPrimary flex items-center gap-2">
              <ScanText className="w-6 h-6 text-accent" />
              Extracted Text
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-surface border border-white/10 text-textPrimary hover:bg-surfaceHover rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {isCopied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {isCopied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownloadTxt}
                className="px-4 py-2 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download .txt
              </button>
            </div>
          </div>
          
          <textarea
            value={extractedText}
            readOnly
            className="w-full h-96 bg-surface border border-white/10 rounded-lg p-6 text-textPrimary focus:outline-none focus:border-accent/50 resize-y font-mono text-sm"
          />

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleReset}
              className="text-textSecondary hover:text-textPrimary underline underline-offset-4 text-sm font-medium"
            >
              Extract text from another file
            </button>
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
