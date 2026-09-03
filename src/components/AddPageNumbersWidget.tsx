"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Download, Loader2, FileDigit } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

type Position = "Bottom-Center" | "Bottom-Left" | "Bottom-Right" | "Top-Center";

export function AddPageNumbersWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");
  
  const [startNumber, setStartNumber] = useState<number>(1);
  const [position, setPosition] = useState<Position>("Bottom-Center");

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

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = String(startNumber + index);
        const fontSize = 12;
        const textWidth = helveticaFont.widthOfTextAtSize(pageNumber, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);
        
        let x = 0;
        let y = 0;
        const marginX = 30;
        const marginY = 30;

        switch (position) {
          case "Bottom-Center":
            x = (width - textWidth) / 2;
            y = marginY;
            break;
          case "Bottom-Left":
            x = marginX;
            y = marginY;
            break;
          case "Bottom-Right":
            x = width - textWidth - marginX;
            y = marginY;
            break;
          case "Top-Center":
            x = (width - textWidth) / 2;
            y = height - textHeight - marginY;
            break;
        }

        page.drawText(pageNumber, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setDownloadFilename(`${baseName}-numbered.pdf`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message || "An error occurred while adding page numbers.");
      } else {
        setErrorMsg("An error occurred while adding page numbers. It might be password protected.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setErrorMsg("");
    setStartNumber(1);
    setPosition("Bottom-Center");
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
                  <FileDigit className="w-8 h-8 text-textSecondary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-textPrimary">Drag & drop your PDF here</p>
                  <p className="text-sm text-textSecondary mt-1">to add page numbers</p>
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

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Starting Number</label>
                  <input 
                    type="number" 
                    value={startNumber} 
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-background border border-white/10 rounded-md px-4 py-2 text-textPrimary focus:outline-none focus:border-accent"
                    min="1"
                  />
                  <p className="text-xs text-textSecondary mt-2">The first page of your PDF will be assigned this number.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as Position)}
                    className="w-full bg-background border border-white/10 rounded-md px-4 py-2 text-textPrimary focus:outline-none focus:border-accent"
                  >
                    <option value="Bottom-Center">Bottom Center</option>
                    <option value="Bottom-Left">Bottom Left</option>
                    <option value="Bottom-Right">Bottom Right</option>
                    <option value="Top-Center">Top Center</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleApply}
                  className="px-6 py-3 bg-accent text-background rounded-md hover:bg-accent/90 transition-colors font-medium text-base flex items-center gap-2"
                >
                  <FileDigit className="w-5 h-5" />
                  Add Page Numbers
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
          <p className="text-textPrimary font-medium">Adding page numbers...</p>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <FileDigit className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-textPrimary">Page Numbers Added!</h3>
            <p className="text-textSecondary mt-2">Your document has been successfully numbered.</p>
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
            Number another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
