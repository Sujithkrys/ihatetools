"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as pdfjsLib from "pdfjs-dist";
import { FileText, Loader2, Copy, Download, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

// Configure worker (reuse from existing setup)
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export function ExtractPdfTextWidget() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);
      setIsProcessing(true);
      setErrorMsg("");
      setWarningMsg("");
      setExtractedText("");

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // @ts-expect-error item.str is part of TextItem
          const strings = textContent.items.map(item => item.str);
          
          if (strings.length > 0) {
            fullText += `--- Page ${i} ---\n\n`;
            // Simple heuristic to keep some spacing
            fullText += strings.join(" ") + "\n\n";
          }
        }

        if (fullText.trim().length === 0) {
          setWarningMsg("No extractable text found. This might be a scanned document or an image-based PDF. Try using our OCR tool instead.");
        } else {
          setExtractedText(fullText.trim());
        }

      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setErrorMsg(err.message || "An error occurred while extracting text.");
        } else {
          setErrorMsg("An error occurred. The PDF might be encrypted.");
        }
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, "")}-extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setExtractedText("");
    setErrorMsg("");
    setWarningMsg("");
    setFileName("");
  };

  return (
    <ToolWidgetShell>
      {!isProcessing && !extractedText && !warningMsg && (
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
                <FileText className="w-8 h-8 text-textSecondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-textPrimary">Drag & drop your PDF here</p>
                <p className="text-sm text-textSecondary mt-1">to extract embedded text</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-surface border border-overlay/10 rounded-md text-textPrimary hover:bg-surfaceHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-textPrimary font-medium">Extracting text...</p>
        </div>
      )}

      {warningMsg && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="w-12 h-12 text-warning" />
          </div>
          <h3 className="text-xl font-bold text-textPrimary">No text found</h3>
          <p className="text-textSecondary max-w-md mx-auto">{warningMsg}</p>
          <div className="pt-4 flex justify-center gap-4">
            <a href="/tools/ocr-pdf" className="px-6 py-2 bg-accent text-background rounded-md font-medium">
              Use OCR Tool
            </a>
            <button onClick={handleReset} className="px-6 py-2 bg-surface border border-overlay/10 text-textPrimary rounded-md">
              Try another file
            </button>
          </div>
        </div>
      )}

      {extractedText && (
        <div className="bg-surface rounded-lg border border-overlay/5 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <h3 className="text-textPrimary font-medium">Extracted Text</h3>
              <p className="text-sm text-textSecondary">{fileName}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-overlay/5 hover:bg-overlay/10 text-textPrimary rounded-md text-sm font-medium transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent/90 text-background rounded-md text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download .txt
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 bg-overlay/5 hover:bg-overlay/10 text-textPrimary rounded-md text-sm font-medium transition-colors ml-2"
              >
                Reset
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={extractedText}
            className="w-full h-[400px] bg-background border border-overlay/10 rounded-md p-4 text-textPrimary font-mono text-sm focus:outline-none resize-none"
          />
        </div>
      )}
    </ToolWidgetShell>
  );
}
