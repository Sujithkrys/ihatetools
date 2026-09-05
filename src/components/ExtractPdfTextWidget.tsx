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
              isDragActive ? "border-accent bg-yellow/5" : "border-ink/15 hover:border-ink/25 hover:bg-paperHover",
              errorMsg ? "border-error/50 bg-error/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-paper">
                <FileText className="w-8 h-8 text-grey" />
              </div>
              <div>
                <p className="text-lg font-medium text-ink">Drag & drop your PDF here</p>
                <p className="text-sm text-grey mt-1">to extract embedded text</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-paper border border-ink/15 rounded-md text-ink hover:bg-paperHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-yellow animate-spin mb-4" />
          <p className="text-ink font-medium">Extracting text...</p>
        </div>
      )}

      {warningMsg && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="w-12 h-12 text-warning" />
          </div>
          <h3 className="text-xl font-bold text-ink">No text found</h3>
          <p className="text-grey max-w-md mx-auto">{warningMsg}</p>
          <div className="pt-4 flex justify-center gap-4">
            <a href="/tools/ocr-pdf" className="px-6 py-2 bg-yellow text-background rounded-md font-medium">
              Use OCR Tool
            </a>
            <button onClick={handleReset} className="px-6 py-2 bg-paper border border-ink/15 text-ink rounded-md">
              Try another file
            </button>
          </div>
        </div>
      )}

      {extractedText && (
        <div className="bg-paper rounded-lg border border-ink/10 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <h3 className="text-ink font-medium">Extracted Text</h3>
              <p className="text-sm text-grey">{fileName}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 text-ink rounded-md text-sm font-medium transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-yellow hover:bg-yellow/90 text-background rounded-md text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download .txt
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 bg-ink/5 hover:bg-overlay/10 text-ink rounded-md text-sm font-medium transition-colors ml-2"
              >
                Reset
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={extractedText}
            className="w-full h-[400px] bg-bg border border-ink/15 rounded-md p-4 text-ink font-mono text-sm focus:outline-none resize-none"
          />
        </div>
      )}
    </ToolWidgetShell>
  );
}
