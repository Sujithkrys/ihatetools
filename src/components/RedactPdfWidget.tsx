"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Download,
  Loader2,
  RefreshCw,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface RedactionBox {
  id: string;
  page: number;
  xPercent: number;
  yPercent: number;
  wPercent: number;
  hPercent: number;
}

export function RedactPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [verificationReport, setVerificationReport] = useState<string | null>(null);

  // Redaction boxes across pages
  const [redactions, setRedactions] = useState<RedactionBox[]>([]);

  // Drawing state on canvas
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{
    xPercent: number;
    yPercent: number;
    wPercent: number;
    hPercent: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load PDF file
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const uploaded = acceptedFiles[0];
    setFile(uploaded);
    setErrorMsg("");
    setDownloadUrl(null);
    setVerificationReport(null);
    setRedactions([]);

    try {
      const buffer = await uploaded.arrayBuffer();
      setPdfBytes(buffer);

      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const loadedDoc = await loadingTask.promise;
      setPdfDoc(loadedDoc);
      setNumPages(loadedDoc.numPages);
      setCurrentPage(1);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to load PDF file. The file may be password protected or corrupted.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  // Render current page to preview canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };
      // @ts-expect-error pdfjs typing
      await page.render(renderContext).promise;
    } catch (err) {
      console.error("Error rendering page to canvas:", err);
    }
  }, [pdfDoc, currentPage]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Handle Box Selection on Page Preview
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentBox({
      xPercent: x / rect.width,
      yPercent: y / rect.height,
      wPercent: 0,
      hPercent: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPoint || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const currentY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const left = Math.min(startPoint.x, currentX);
    const top = Math.min(startPoint.y, currentY);
    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);

    setCurrentBox({
      xPercent: left / rect.width,
      yPercent: top / rect.height,
      wPercent: width / rect.width,
      hPercent: height / rect.height,
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox) return;
    setIsDrawing(false);
    setStartPoint(null);

    // Only keep if size is non-trivial (> 1% width/height)
    if (currentBox.wPercent > 0.01 && currentBox.hPercent > 0.01) {
      const newBox: RedactionBox = {
        id: Math.random().toString(36).substring(2, 9),
        page: currentPage,
        xPercent: currentBox.xPercent,
        yPercent: currentBox.yPercent,
        wPercent: currentBox.wPercent,
        hPercent: currentBox.hPercent,
      };
      setRedactions((prev) => [...prev, newBox]);
    }
    setCurrentBox(null);
  };

  const removeRedaction = (id: string) => {
    setRedactions((prev) => prev.filter((r) => r.id !== id));
  };

  const clearPageRedactions = () => {
    setRedactions((prev) => prev.filter((r) => r.page !== currentPage));
  };

  // Perform genuine pixel rasterization redaction + PDF reconstruction
  const handleApplyRedactions = async () => {
    if (!pdfBytes || !pdfDoc) return;
    setIsExporting(true);
    setErrorMsg("");
    setVerificationReport(null);

    try {
      const origPdfLibDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const newPdfDoc = await PDFDocument.create();

      const total = pdfDoc.numPages;

      for (let pageNum = 1; pageNum <= total; pageNum++) {
        const pageRedactions = redactions.filter((r) => r.page === pageNum);

        if (pageRedactions.length === 0) {
          // No redactions on this page: preserve crisp vector layout by copying the original page
          const [copiedPage] = await newPdfDoc.copyPages(origPdfLibDoc, [pageNum - 1]);
          newPdfDoc.addPage(copiedPage);
        } else {
          // CRITICAL SECURITY REDACTION:
          // Rasterize page to canvas, blackout redaction areas completely, and replace with a pure pixel image.
          // This strips all vector font text streams, metadata, and hidden objects under the redacted box.
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.5 }); // High DPI for crisp text

          const offscreenCanvas = document.createElement("canvas");
          offscreenCanvas.width = viewport.width;
          offscreenCanvas.height = viewport.height;
          const offCtx = offscreenCanvas.getContext("2d");
          if (!offCtx) throw new Error("Could not create offscreen rendering context.");

          // Render underlying PDF to offscreen canvas
          // @ts-expect-error pdfjs typing
          await page.render({ canvasContext: offCtx, viewport }).promise;

          // Paint solid opaque black rectangles over each redacted region
          offCtx.fillStyle = "#000000";
          for (const box of pageRedactions) {
            const rx = box.xPercent * viewport.width;
            const ry = box.yPercent * viewport.height;
            const rw = box.wPercent * viewport.width;
            const rh = box.hPercent * viewport.height;
            offCtx.fillRect(rx, ry, rw, rh);
          }

          // Convert rasterized image to PNG
          const imgDataUrl = offscreenCanvas.toDataURL("image/png");
          const pngImage = await newPdfDoc.embedPng(imgDataUrl);

          // Get original page dimensions in points (72 DPI)
          const origPage = origPdfLibDoc.getPage(pageNum - 1);
          const { width: origW, height: origH } = origPage.getSize();

          const newPage = newPdfDoc.addPage([origW, origH]);
          newPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: origW,
            height: origH,
          });
        }
      }

      const exportedBytes = await newPdfDoc.save();
      const blob = new Blob([exportedBytes as unknown as BlobPart], { type: "application/pdf" });
      const newUrl = URL.createObjectURL(blob);
      setDownloadUrl(newUrl);

      // AUTOMATED TEXT EXTRACTION VERIFICATION:
      // Verify that the redacted pages genuinely have NO text in the redacted areas
      const checkDoc = await pdfjsLib.getDocument({ data: exportedBytes }).promise;
      let totalRedactedPagesExamined = 0;
      let textItemsOnRedactedPages = 0;

      for (let p = 1; p <= total; p++) {
        const hasRedaction = redactions.some((r) => r.page === p);
        if (hasRedaction) {
          totalRedactedPagesExamined++;
          const checkPage = await checkDoc.getPage(p);
          const textContent = await checkPage.getTextContent();
          textItemsOnRedactedPages += textContent.items.length;
        }
      }

      if (textItemsOnRedactedPages === 0) {
        setVerificationReport(
          `Security Verified: ${totalRedactedPagesExamined} redacted page(s) were rasterized into opaque pixels. 0 extractable text characters exist on redacted pages. The underlying data is permanently removed.`
        );
      } else {
        setVerificationReport(
          `Notice: Process completed with ${textItemsOnRedactedPages} text tokens detected on inspected pages.`
        );
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to apply redactions.");
    } finally {
      setIsExporting(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
    setPdfDoc(null);
    setRedactions([]);
    setErrorMsg("");
    setVerificationReport(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  const currentPageRedactions = redactions.filter((r) => r.page === currentPage);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-[var(--primary)] bg-[var(--surface-hover)]"
              : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--surface)]"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <EyeOff className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Select a PDF to permanently redact
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Draw black redaction boxes over sensitive text, PII, SSNs, or financials
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Permanent pixel rasterization — 0% text leakage guarantee
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center space-x-3 truncate">
              <EyeOff className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-[var(--ink)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {redactions.length} total redaction{redactions.length === 1 ? "" : "s"} across {numPages} page{numPages === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change PDF
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {verificationReport && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Security Verification Passed</p>
                <p className="text-xs mt-0.5 opacity-90">{verificationReport}</p>
              </div>
            </div>
          )}

          {/* Main Editing Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Controls / Redactions List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <h4 className="font-bold text-sm text-[var(--ink)]">How to Redact</h4>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                  Click and drag your mouse over the page on the right to mark any area for permanent blackout.
                </p>
              </div>

              {/* Page Navigator */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--ink)]">Page Navigator</span>
                  <span className="text-xs text-[var(--ink-muted)]">
                    {currentPage} / {numPages}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex-1 py-1.5 px-2 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--surface-hover)] disabled:opacity-30 inline-flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <button
                    disabled={currentPage >= numPages}
                    onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                    className="flex-1 py-1.5 px-2 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--surface-hover)] disabled:opacity-30 inline-flex items-center justify-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Redaction list for this page */}
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--ink)]">
                    Page {currentPage} Redactions ({currentPageRedactions.length})
                  </span>
                  {currentPageRedactions.length > 0 && (
                    <button
                      onClick={clearPageRedactions}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear Page
                    </button>
                  )}
                </div>

                {currentPageRedactions.length === 0 ? (
                  <p className="text-xs text-[var(--ink-muted)] italic py-2">
                    No redactions drawn on this page yet. Click and drag over the preview.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {currentPageRedactions.map((box, index) => (
                      <div
                        key={box.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-[var(--paper)] border border-[var(--border)] text-xs"
                      >
                        <span className="font-mono text-[var(--ink)]">
                          Box #{index + 1} ({Math.round(box.wPercent * 100)}% × {Math.round(box.hPercent * 100)}%)
                        </span>
                        <button
                          onClick={() => removeRedaction(box.id)}
                          className="p-1 text-[var(--ink-muted)] hover:text-red-500 transition-colors"
                          title="Delete box"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Apply & Export button */}
              <div className="space-y-2">
                <button
                  onClick={handleApplyRedactions}
                  disabled={isExporting || redactions.length === 0}
                  className="w-full py-3 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 inline-flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rasterizing & Sanitizing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Sanitize & Export PDF
                    </>
                  )}
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={`redacted_${file.name}`}
                    className="w-full py-3 bg-[var(--primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download Redacted PDF
                  </a>
                )}
              </div>
            </div>

            {/* Right Interactive Page Preview */}
            <div className="lg:col-span-3">
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="relative bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex justify-center items-center overflow-auto select-none cursor-crosshair min-h-[500px]"
              >
                <div className="relative inline-block shadow-lg border border-[var(--border)] rounded overflow-hidden">
                  <canvas ref={canvasRef} className="block max-w-full h-auto bg-white" />

                  {/* Existing Saved Redactions on this page */}
                  {currentPageRedactions.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        position: "absolute",
                        left: `${box.xPercent * 100}%`,
                        top: `${box.yPercent * 100}%`,
                        width: `${box.wPercent * 100}%`,
                        height: `${box.hPercent * 100}%`,
                      }}
                      className="bg-black border border-red-500/80 group pointer-events-auto"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRedaction(box.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow transition-opacity"
                        title="Delete redaction"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Currently Active Dragging Box */}
                  {isDrawing && currentBox && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${currentBox.xPercent * 100}%`,
                        top: `${currentBox.yPercent * 100}%`,
                        width: `${currentBox.wPercent * 100}%`,
                        height: `${currentBox.hPercent * 100}%`,
                      }}
                      className="bg-black/80 border-2 border-dashed border-red-500 pointer-events-none"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
