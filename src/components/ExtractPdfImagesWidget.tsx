"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";
import JSZip from "jszip";
import { Download, Loader2, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

interface ExtractedImage {
  id: string;
  name: string;
  blob: Blob;
  url: string;
}

export function ExtractPdfImagesWidget() {
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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
      setImages([]);
      setDownloadUrl(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        const extracted: ExtractedImage[] = [];
        let imgCount = 0;

        const objects = pdfDoc.context.enumerateIndirectObjects();
        for (const [, obj] of objects) {
          if (obj instanceof PDFRawStream) {
            const dict = obj.dict;
            const subtype = dict.lookup(PDFName.of('Subtype'));
            
            // @ts-expect-error PDFName has decodeText method
            if (subtype && subtype.decodeText() === 'Image') {
              const filter = dict.lookup(PDFName.of('Filter'));
              
              // We support DCTDecode (JPEG) natively as it maps 1:1 to a JPEG file stream.
              let isJpeg = false;
              // @ts-expect-error handling different dict lookups
              if (filter && filter.decodeText && filter.decodeText() === 'DCTDecode') {
                isJpeg = true;
              } else if (Array.isArray(filter)) {
                // handling different dict lookups
                isJpeg = filter.some(f => f.decodeText && f.decodeText() === 'DCTDecode');
              }
              
              if (isJpeg) {
                const blob = new Blob([new Uint8Array(obj.contents)], { type: "image/jpeg" });
                const url = URL.createObjectURL(blob);
                extracted.push({
                  id: `img_${imgCount}`,
                  name: `extracted_${imgCount + 1}.jpg`,
                  blob,
                  url
                });
                imgCount++;
              }
            }
          }
        }

        if (extracted.length === 0) {
          setWarningMsg("No extractable JPEG images were found in this document. Some vector graphics or raw flated bitmaps cannot be directly extracted as files.");
        } else {
          setImages(extracted);
          
          if (extracted.length > 1) {
            const zip = new JSZip();
            extracted.forEach(img => {
              zip.file(img.name, img.blob);
            });
            const zipBlob = await zip.generateAsync({ type: "blob" });
            setDownloadUrl(URL.createObjectURL(zipBlob));
          } else {
            setDownloadUrl(extracted[0].url);
          }
        }
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setErrorMsg(err.message || "An error occurred while extracting images.");
        } else {
          setErrorMsg("An error occurred. The PDF might be password protected.");
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

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    if (downloadUrl && images.length > 1) URL.revokeObjectURL(downloadUrl);
    
    setImages([]);
    setErrorMsg("");
    setWarningMsg("");
    setFileName("");
    setDownloadUrl(null);
  };

  return (
    <ToolWidgetShell>
      {!isProcessing && images.length === 0 && !warningMsg && (
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
                <ImageIcon className="w-8 h-8 text-grey" />
              </div>
              <div>
                <p className="text-lg font-medium text-ink">Drag & drop your PDF here</p>
                <p className="text-sm text-grey mt-1">to extract embedded images</p>
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
          <p className="text-ink font-medium">Scanning PDF for embedded images...</p>
        </div>
      )}

      {warningMsg && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="w-12 h-12 text-warning" />
          </div>
          <h3 className="text-xl font-bold text-ink">No Images Found</h3>
          <p className="text-grey max-w-md mx-auto">{warningMsg}</p>
          <div className="pt-4 flex justify-center">
            <button onClick={handleReset} className="px-6 py-2 bg-paper border border-ink/15 text-ink rounded-md">
              Try another file
            </button>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="bg-paper rounded-lg border border-ink/10 p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <h3 className="text-ink font-medium">Found {images.length} Image{images.length > 1 ? 's' : ''}</h3>
              <p className="text-sm text-grey">{fileName}</p>
            </div>
            
            <div className="flex gap-2">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={images.length > 1 ? `${fileName.replace(/\.[^/.]+$/, "")}-images.zip` : images[0].name}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow hover:bg-yellow/90 text-background rounded-md text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {images.length > 1 ? "Download All (ZIP)" : "Download JPG"}
                </a>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-ink/5 hover:bg-overlay/10 text-ink rounded-md text-sm font-medium transition-colors ml-2"
              >
                Start Over
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-md p-2 flex flex-col items-center bg-bg border border-ink/10 hover:border-ink/15 transition-colors">
                <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center bg-black/20 rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.url} 
                    alt={img.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-xs text-grey mt-2 truncate w-full text-center">{img.name}</p>
                <a 
                  href={img.url}
                  download={img.name}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                >
                  <Download className="w-6 h-6 text-white" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolWidgetShell>
  );
}
