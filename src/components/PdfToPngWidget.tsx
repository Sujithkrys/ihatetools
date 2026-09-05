"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { Download, Loader2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

// Configure pdfjs worker
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export function PdfToPngWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");

  const processPdf = async (uploadedFile: File) => {
    setIsProcessing(true);
    setDownloadUrl(null);
    setErrorMsg("");

    try {
      setProgressMsg("Loading PDF...");
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const zip = new JSZip();
      let singleBlob: Blob | null = null;

      for (let i = 1; i <= numPages; i++) {
        setProgressMsg(`Converting page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        // Use 2.0 scale for high-quality PNG extraction
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not create canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render(renderContext as any).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Canvas to Blob failed"));
            },
            "image/png"
          );
        });

        if (numPages === 1) {
          singleBlob = blob;
        } else {
          // Zero-pad page numbers (e.g. page-01.png)
          const padLen = numPages.toString().length;
          const pageNumStr = i.toString().padStart(padLen, "0");
          zip.file(`page-${pageNumStr}.png`, blob);
        }
      }

      setProgressMsg("Finalizing...");
      const baseName = uploadedFile.name.replace(/\.[^/.]+$/, "");

      if (numPages === 1 && singleBlob) {
        setDownloadUrl(URL.createObjectURL(singleBlob));
        setDownloadFilename(`${baseName}.png`);
      } else {
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setDownloadUrl(URL.createObjectURL(zipBlob));
        setDownloadFilename(`${baseName}-pngs.zip`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to convert PDF. The file may be password protected/corrupted, or your browser is blocking the PDF engine.");
      setFile(null);
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only PDF files are supported.");
      return;
    }
    if (acceptedFiles.length === 0) return;

    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    processPdf(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setErrorMsg("");
  };

  return (
    <ToolWidgetShell>
      {!file && !isProcessing && !downloadUrl && (
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
              <p className="text-sm text-grey mt-1">or select it from your device to extract PNGs</p>
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
          <p className="text-ink font-medium">{progressMsg}</p>
          <p className="text-sm text-grey mt-2">This may take a moment for large files.</p>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <Download className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">Conversion Complete!</h3>
            <p className="text-grey mt-2">Your PDF pages have been converted to high-quality PNGs.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download {downloadFilename.endsWith('.zip') ? 'ZIP' : 'PNG'}
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-grey hover:text-ink underline underline-offset-4 text-sm mt-4"
          >
            Convert another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
