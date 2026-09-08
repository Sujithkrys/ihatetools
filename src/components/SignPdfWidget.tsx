"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, RefreshCw, Pen, Type, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

type SigTab = "draw" | "type";

export function SignPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");

  // Signature state
  const [sigTab, setSigTab] = useState<SigTab>("draw");
  const [typedName, setTypedName] = useState("");
  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(3);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Placement state on current preview page
  // Percentages relative to preview canvas (0 to 1)
  const [sigPlacement, setSigPlacement] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  } | null>(null);

  // Canvas refs
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Dragging placement state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });

  // Load PDF file
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const uploaded = acceptedFiles[0];
    setFile(uploaded);
    setErrorMsg("");
    setDownloadUrl(null);
    setIsProcessing(true);
    setSigPlacement(null);

    try {
      const buffer = await uploaded.arrayBuffer();
      setPdfBytes(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load PDF file. Please ensure it is a valid document.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  // Render PDF page to preview canvas
  const renderPdfPage = useCallback(async (pageNumber: number) => {
    if (!pdfDoc || !pdfCanvasRef.current) return;
    try {
      const page = await pdfDoc.getPage(pageNumber);
      const containerWidth = Math.min(680, window.innerWidth - 64);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const scale = containerWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({ canvasContext: ctx, viewport } as any).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    }
  }, [pdfDoc]);

  useEffect(() => {
    if (pdfDoc) {
      renderPdfPage(currentPage);
    }
  }, [pdfDoc, currentPage, renderPdfPage]);

  // Handle signature drawing on canvas pad
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  // Convert typed name to canvas signature
  const generateTypedSignature = (text: string, color: string) => {
    if (!text.trim()) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 450;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.font = "italic 44px 'Caveat', 'Segoe Script', cursive, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text.trim(), canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL("image/png");
  };

  // Confirm Signature for placement
  const handleAdoptSignature = () => {
    let dataUrl: string | null = null;
    if (sigTab === "draw") {
      const canvas = drawCanvasRef.current;
      if (canvas) {
        dataUrl = canvas.toDataURL("image/png");
      }
    } else {
      dataUrl = generateTypedSignature(typedName, penColor);
    }

    if (!dataUrl) {
      setErrorMsg("Please draw or type your signature first.");
      return;
    }

    setSignatureDataUrl(dataUrl);
    setErrorMsg("");

    // Set initial placement centered near bottom of current preview page
    setSigPlacement({
      x: 0.35,
      y: 0.75,
      width: 0.3,
      height: 0.1,
      page: currentPage,
    });
  };

  // Dragging placement handlers
  const handlePlacementMouseDown = (e: React.MouseEvent) => {
    if (!sigPlacement) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: sigPlacement.x,
      initialY: sigPlacement.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sigPlacement || !pdfCanvasRef.current) return;
      const canvasRect = pdfCanvasRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - dragStartRef.current.mouseX) / canvasRect.width;
      const deltaY = (e.clientY - dragStartRef.current.mouseY) / canvasRect.height;

      const newX = Math.max(0, Math.min(1 - sigPlacement.width, dragStartRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(1 - sigPlacement.height, dragStartRef.current.initialY + deltaY));

      setSigPlacement((prev) => (prev ? { ...prev, x: newX, y: newY } : null));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, sigPlacement]);

  // Embed signature onto output PDF
  const handleApplySignature = async () => {
    if (!pdfBytes || !signatureDataUrl || !sigPlacement) {
      setErrorMsg("Signature placement missing.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      const doc = await PDFDocument.load(pdfBytes);
      const targetPage = doc.getPage(sigPlacement.page - 1);
      const { width: pageWidth, height: pageHeight } = targetPage.getSize();

      // Convert dataUrl to bytes
      const pngImageBytes = await fetch(signatureDataUrl).then((res) => res.arrayBuffer());
      const sigImage = await doc.embedPng(pngImageBytes);

      // pdf-lib coordinate system has (0,0) at bottom-left
      const targetWidth = sigPlacement.width * pageWidth;
      const targetHeight = sigPlacement.height * pageHeight;
      const targetX = sigPlacement.x * pageWidth;
      const targetY = pageHeight - (sigPlacement.y * pageHeight) - targetHeight;

      targetPage.drawImage(sigImage, {
        x: targetX,
        y: targetY,
        width: targetWidth,
        height: targetHeight,
      });

      const savedBytes = await doc.save();
      const blob = new Blob([savedBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadFilename(file ? file.name.replace(/\.pdf$/i, "-signed.pdf") : "signed-document.pdf");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to embed signature into PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfBytes(null);
    setPdfDoc(null);
    setSigPlacement(null);
    setSignatureDataUrl(null);
    setDownloadUrl(null);
    setErrorMsg("");
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`dropzone border-2 border-dashed rounded-[10px] p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-yellow bg-yellow/5" : "border-ink/20 hover:border-ink/40 bg-paper"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow/10 flex items-center justify-center text-ink">
              <Pen size={24} />
            </div>
            <div>
              <p className="text-[15px] font-medium text-ink">
                Drop your PDF here, or <span className="text-pink underline">browse</span>
              </p>
              <p className="text-[13px] text-grey mt-1">Files never leave your device. Sign securely in your browser.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top file indicator and reset */}
          <div className="flex items-center justify-between p-4 bg-bg border border-ink/10 rounded-[8px]">
            <div>
              <p className="text-[14px] font-medium text-ink truncate max-w-sm">{file.name}</p>
              <p className="text-[12px] text-grey">{numPages} {numPages === 1 ? "page" : "pages"}</p>
            </div>
            <button
              onClick={handleReset}
              className="text-[13px] text-grey hover:text-ink flex items-center gap-1.5 px-3 py-1.5 border border-ink/15 rounded-[6px] hover:border-ink/30 transition-all"
            >
              <RefreshCw size={13} /> Change file
            </button>
          </div>

          {/* Signature Creation Card */}
          {!signatureDataUrl ? (
            <div className="bg-paper border border-ink/15 rounded-[10px] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <h3 className="disp text-[18px] text-ink font-semibold">Create Your Signature</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSigTab("draw")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[13px] rounded-[6px] font-medium transition-colors ${
                      sigTab === "draw" ? "bg-ink text-paper" : "bg-bg text-grey hover:text-ink"
                    }`}
                  >
                    <Pen size={13} /> Draw
                  </button>
                  <button
                    onClick={() => setSigTab("type")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[13px] rounded-[6px] font-medium transition-colors ${
                      sigTab === "type" ? "bg-ink text-paper" : "bg-bg text-grey hover:text-ink"
                    }`}
                  >
                    <Type size={13} /> Type
                  </button>
                </div>
              </div>

              {/* Color & stroke options */}
              <div className="flex items-center gap-4 text-[13px]">
                <span className="text-grey font-medium">Ink Color:</span>
                <div className="flex gap-2">
                  {[
                    { label: "Black", val: "#000000" },
                    { label: "Navy", val: "#002B49" },
                    { label: "Red", val: "#C5221F" },
                  ].map((c) => (
                    <button
                      key={c.val}
                      onClick={() => setPenColor(c.val)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        penColor === c.val ? "scale-110 border-ink" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.val }}
                      title={c.label}
                    />
                  ))}
                </div>

                {sigTab === "draw" && (
                  <>
                    <span className="text-grey font-medium ml-4">Line Width:</span>
                    <div className="flex gap-1.5">
                      {[2, 3, 5].map((w) => (
                        <button
                          key={w}
                          onClick={() => setPenWidth(w)}
                          className={`px-2 py-0.5 rounded text-[12px] border ${
                            penWidth === w ? "bg-ink text-paper border-ink" : "bg-bg text-grey border-ink/15"
                          }`}
                        >
                          {w === 2 ? "Fine" : w === 3 ? "Medium" : "Bold"}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Pad Area */}
              {sigTab === "draw" ? (
                <div className="space-y-2">
                  <div className="relative border-2 border-dashed border-ink/20 rounded-[8px] bg-bg overflow-hidden">
                    <canvas
                      ref={drawCanvasRef}
                      width={520}
                      height={160}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-[160px] cursor-crosshair touch-none"
                    />
                    <span className="absolute bottom-2 left-3 text-[11px] text-grey pointer-events-none">
                      Draw inside the box
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <button
                      onClick={clearCanvas}
                      className="text-[12px] text-grey hover:text-ink underline"
                    >
                      Clear pad
                    </button>
                    <button
                      onClick={handleAdoptSignature}
                      className="bg-ink text-paper px-4 py-2 rounded-[6px] text-[13px] font-medium hover:bg-ink/90 transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} /> Place Signature
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type your full name..."
                    className="w-full px-3 py-2 border border-ink/20 rounded-[6px] bg-bg text-ink text-[15px] focus:outline-none focus:border-ink"
                  />
                  {typedName && (
                    <div className="p-4 border border-ink/10 rounded-[8px] bg-bg flex items-center justify-center">
                      <p
                        className="text-[34px] italic"
                        style={{ color: penColor, fontFamily: "'Caveat', cursive, sans-serif" }}
                      >
                        {typedName}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleAdoptSignature}
                      disabled={!typedName.trim()}
                      className="bg-ink text-paper disabled:opacity-40 px-4 py-2 rounded-[6px] text-[13px] font-medium hover:bg-ink/90 transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} /> Place Signature
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-paper border border-ink/15 rounded-[10px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={signatureDataUrl} alt="Signature preview" className="h-10 border border-ink/10 rounded bg-bg px-2" />
                <span className="text-[13px] text-ink font-medium">Signature ready! Drag to place on page {currentPage}.</span>
              </div>
              <button
                onClick={() => setSignatureDataUrl(null)}
                className="text-[12px] text-grey hover:text-ink underline"
              >
                Change signature
              </button>
            </div>
          )}

          {/* PDF Page View and Interactive Overlay */}
          <div className="space-y-3">
            {numPages > 1 && (
              <div className="flex items-center justify-between bg-paper border border-ink/10 rounded-[6px] px-3 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const prev = Math.max(1, currentPage - 1);
                      setCurrentPage(prev);
                      if (sigPlacement) setSigPlacement({ ...sigPlacement, page: prev });
                    }}
                    disabled={currentPage <= 1}
                    className="p-1 rounded hover:bg-bg disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[13px] text-ink font-medium">
                    Page {currentPage} of {numPages}
                  </span>
                  <button
                    onClick={() => {
                      const next = Math.min(numPages, currentPage + 1);
                      setCurrentPage(next);
                      if (sigPlacement) setSigPlacement({ ...sigPlacement, page: next });
                    }}
                    disabled={currentPage >= numPages}
                    className="p-1 rounded hover:bg-bg disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <span className="text-[12px] text-grey">Click and drag signature to position</span>
              </div>
            )}

            <div className="relative border border-ink/20 rounded-[8px] bg-bg overflow-hidden flex justify-center p-4">
              <div className="relative inline-block shadow-sm">
                <canvas ref={pdfCanvasRef} className="block max-w-full h-auto bg-paper border border-ink/10" />

                {/* Draggable Signature Overlay on current page */}
                {signatureDataUrl && sigPlacement && sigPlacement.page === currentPage && (
                  <div
                    onMouseDown={handlePlacementMouseDown}
                    style={{
                      position: "absolute",
                      left: `${sigPlacement.x * 100}%`,
                      top: `${sigPlacement.y * 100}%`,
                      width: `${sigPlacement.width * 100}%`,
                      height: `${sigPlacement.height * 100}%`,
                      cursor: isDragging ? "grabbing" : "grab",
                    }}
                    className="border-2 border-dashed border-ink bg-yellow/15 flex items-center justify-center select-none"
                    title="Drag to reposition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={signatureDataUrl}
                      alt="Signature placement"
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />
                    <div className="absolute top-[-8px] right-[-8px] w-4 h-4 rounded-full bg-ink text-paper text-[9px] flex items-center justify-center pointer-events-none">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resize Slider */}
            {signatureDataUrl && sigPlacement && (
              <div className="flex items-center gap-4 bg-paper border border-ink/10 rounded-[8px] px-4 py-3 text-[13px]">
                <span className="text-grey font-medium">Signature Size:</span>
                <input
                  type="range"
                  min="15"
                  max="50"
                  value={Math.round(sigPlacement.width * 100)}
                  onChange={(e) => {
                    const w = parseInt(e.target.value, 10) / 100;
                    setSigPlacement((prev) => (prev ? { ...prev, width: w, height: w * 0.35 } : null));
                  }}
                  className="w-48 cursor-pointer"
                />
                <span className="text-grey">{Math.round(sigPlacement.width * 100)}%</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {signatureDataUrl && !downloadUrl && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleApplySignature}
                disabled={isProcessing}
                className="bg-ink text-paper px-6 py-3 rounded-[8px] text-[14.5px] font-medium hover:bg-ink/90 transition-all flex items-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving PDF...
                  </>
                ) : (
                  <>Embed Signature & Download</>
                )}
              </button>
            </div>
          )}

          {/* Success Download Card */}
          {downloadUrl && (
            <div className="p-6 bg-paper border-2 border-ink rounded-[10px] text-center space-y-4">
              <div className="w-12 h-12 bg-yellow/20 text-ink rounded-full flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <div>
                <h4 className="disp text-[20px] font-semibold text-ink">PDF Signed Successfully!</h4>
                <p className="text-[13.5px] text-grey mt-1">Your signature is permanently embedded.</p>
              </div>
              <div className="flex justify-center gap-3">
                <a
                  href={downloadUrl}
                  download={downloadFilename}
                  className="bg-ink text-paper px-6 py-2.5 rounded-[8px] text-[14px] font-medium hover:bg-ink/90 transition-all flex items-center gap-2"
                >
                  <Download size={15} /> Download Signed PDF
                </a>
                <button
                  onClick={handleReset}
                  className="border border-ink/20 px-4 py-2.5 rounded-[8px] text-[14px] text-grey hover:text-ink transition-colors"
                >
                  Sign Another Document
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-pink/10 border border-pink/30 rounded-[8px] text-pink text-[13.5px]">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
