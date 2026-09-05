"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2 } from "lucide-react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function CropImageWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");
  
  const imgRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only JPG, PNG, and WEBP images are supported.");
      return;
    }
    if (acceptedFiles.length === 0) return;

    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setErrorMsg("");
    setDownloadUrl(null);

    const url = URL.createObjectURL(uploadedFile);
    setImageSrc(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  const handleApplyCrop = async () => {
    if (!imgRef.current || !crop || crop.width === 0 || crop.height === 0 || !file) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas is empty"));
          },
          file.type,
          1.0
        );
      });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const ext = file.name.split('.').pop();
      setDownloadFilename(`${baseName}-cropped.${ext}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while cropping the image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImageSrc("");
    setCrop(undefined);
    setDownloadUrl(null);
    setErrorMsg("");
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
              <p className="text-lg font-medium text-ink">Drag & drop your image here</p>
              <p className="text-sm text-grey mt-1">JPG, PNG, or WEBP</p>
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
          <p className="text-ink font-medium">Cropping image...</p>
        </div>
      )}

      {file && imageSrc && !isProcessing && !downloadUrl && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
            <div>
              <h3 className="text-lg font-medium text-ink">{file.name}</h3>
              <p className="text-sm text-grey">Draw a rectangle to crop.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-paper border border-ink/15 rounded-md text-ink hover:bg-paperHover transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCrop}
                disabled={!crop || crop.width === 0 || crop.height === 0}
                className="px-4 py-2 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Crop
              </button>
            </div>
          </div>
          
          {errorMsg && <p className="text-error text-sm">{errorMsg}</p>}

          <div className="bg-paper rounded-lg border border-ink/10 p-4 flex justify-center max-h-[60vh] overflow-hidden">
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                ref={imgRef}
                src={imageSrc} 
                alt="Crop preview" 
                className="max-w-full max-h-[50vh] object-contain"
              />
            </ReactCrop>
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <Download className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">Image Cropped!</h3>
            <p className="text-grey mt-2">Your image has been cropped successfully at native resolution.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Image
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-grey hover:text-ink underline underline-offset-4 text-sm mt-4"
          >
            Crop another image
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
