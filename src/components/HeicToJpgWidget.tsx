"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { Download, Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { convertHeic } from "@keeratita/heic-converter";

interface FileProgress {
  file: File;
  status: "pending" | "converting" | "done" | "error";
  progress: number;
  blob?: Blob;
  error?: string;
}

export function HeicToJpgWidget() {
  const [files, setFiles] = useState<FileProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Only HEIC images are supported.");
    } else {
      setErrorMsg("");
    }

    if (acceptedFiles.length > 0) {
      setFiles(prev => [
        ...prev,
        ...acceptedFiles.map(file => ({
          file,
          status: "pending" as const,
          progress: 0,
        }))
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/heic": [".heic", ".HEIC"],
      "image/heif": [".heif", ".HEIF"],
    },
  });

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setErrorMsg("");

    const newFiles = [...files];
    const zip = new JSZip();
    let hasError = false;

    for (let i = 0; i < newFiles.length; i++) {
      if (newFiles[i].status === "done") continue;
      
      newFiles[i].status = "converting";
      setFiles([...newFiles]);

      try {
        const file = newFiles[i].file;
        
        const blob = await convertHeic(file, {
          to: "jpeg",
          quality: 0.9,
          onProgress: (percent: number) => {
            newFiles[i].progress = percent * 100;
            setFiles([...newFiles]);
          }
        });

        newFiles[i].status = "done";
        newFiles[i].blob = blob;
        newFiles[i].progress = 100;

        const baseName = file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${baseName}.jpg`, blob);

      } catch (err: unknown) {
        console.error(err);
        newFiles[i].status = "error";
        newFiles[i].error = "Conversion failed";
        hasError = true;
      }
      
      setFiles([...newFiles]);
    }

    const successfulFiles = newFiles.filter(f => f.status === "done" && f.blob);

    if (successfulFiles.length > 0) {
      if (successfulFiles.length === 1) {
        // Single file download
        const url = URL.createObjectURL(successfulFiles[0].blob!);
        setDownloadUrl(url);
        const baseName = successfulFiles[0].file.name.replace(/\.[^/.]+$/, "");
        setDownloadFilename(`${baseName}.jpg`);
      } else {
        // Multi-file ZIP download
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        setDownloadUrl(url);
        setDownloadFilename(`converted-images.zip`);
      }
    } else if (hasError) {
      setErrorMsg("Failed to convert the selected HEIC files.");
    }

    setIsProcessing(false);
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadUrl(null);
    setErrorMsg("");
  };

  return (
    <ToolWidgetShell>
      {!downloadUrl && !isProcessing && files.length === 0 && (
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
                <p className="text-lg font-medium text-ink">Drag & drop your HEIC files here</p>
                <p className="text-sm text-grey mt-1">or click to browse</p>
              </div>
              <button className="mt-4 px-6 py-2 bg-paper border border-ink/15 rounded-md text-ink hover:bg-paperHover transition-colors font-medium">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {!downloadUrl && files.length > 0 && (
        <div className="bg-paper rounded-lg border border-ink/10 p-4 sm:p-6 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-ink font-medium">Selected Files ({files.length})</h3>
            {!isProcessing && (
              <div
                {...getRootProps()}
                className="text-sm text-yellow hover:text-yellow/80 cursor-pointer"
              >
                <input {...getInputProps()} />
                + Add more
              </div>
            )}
          </div>
          
          <ul className="divide-y divide-white/10 max-h-[300px] overflow-y-auto pr-2">
            {files.map((fileObj, idx) => (
              <li key={idx} className="py-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-bg rounded">
                      <ImageIcon className="w-4 h-4 text-grey" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-ink truncate">{fileObj.file.name}</p>
                      <p className="text-xs text-grey">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  {!isProcessing && fileObj.status === "pending" && (
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-grey hover:text-error transition-colors p-1"
                    >
                      ×
                    </button>
                  )}
                  {fileObj.status === "done" && <CheckCircle className="w-5 h-5 text-success" />}
                  {fileObj.status === "error" && <span className="text-error text-xs font-medium">Failed</span>}
                </div>
                
                {/* Progress Bar */}
                {(fileObj.status === "converting" || fileObj.status === "done") && (
                  <div className="w-full bg-ink/5 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-yellow h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${fileObj.progress}%` }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="px-6 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-base flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              Convert to JPG
            </button>
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">Conversion Complete!</h3>
            <p className="text-grey mt-2">Your HEIC files have been converted to JPG.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-yellow text-background rounded-md hover:bg-yellow/90 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download {downloadFilename.endsWith('.zip') ? 'ZIP' : 'JPG'}
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-grey hover:text-ink underline underline-offset-4 text-sm mt-4"
          >
            Convert more files
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
