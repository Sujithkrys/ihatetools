"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Code2, Copy, CheckCircle } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function ImageToBase64Widget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [base64Str, setBase64Str] = useState("");
  const [copied, setCopied] = useState(false);

  const processFile = (uploadedFile: File) => {
    setIsProcessing(true);
    setBase64Str("");
    setErrorMsg("");

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setBase64Str(e.target.result);
      } else {
        setErrorMsg("Failed to read file as Data URL.");
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorMsg("Error reading file.");
      setIsProcessing(false);
    };
    
    // Read the file as a data URL (base64)
    reader.readAsDataURL(uploadedFile);
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid image file.");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "image/svg+xml": [".svg"],
    },
    maxFiles: 1,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(base64Str);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <ToolWidgetShell>
      {!file && (
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-[16px] p-12 text-center cursor-pointer transition-all tool-interaction-zone",
              isDragActive
                ? "border-ink/40 dark:border-white/40 bg-ink/[0.03] dark:bg-white/[0.03]"
                : "border-ink/15 dark:border-white/15 hover:border-ink/25 dark:hover:border-white/25 hover:bg-ink/[0.015] dark:hover:bg-white/[0.02]",
              errorMsg ? "border-pink/40 bg-pink/5" : ""
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-ink/5 dark:bg-white/5">
                <Code2 className="w-6 h-6 text-grey" />
              </div>
              <div>
                <p className="text-lg font-medium text-ink">Drag & drop your Image here</p>
                <p className="text-sm text-grey mt-1">to encode it as a Base64 data URI</p>
              </div>
              <button className="mt-2 px-5 py-2.5 bg-ink text-paper rounded-[9px] text-[13.5px] font-medium shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all">
                Browse files
              </button>
            </div>
          </div>
          {errorMsg && <p className="text-pink text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {file && (
        <div className="animate-reveal-result bg-paper rounded-[16px] border border-ink/8 dark:border-white/10 shadow-soft dark:shadow-soft-dark p-4 sm:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-ink font-medium">Selected Image</h3>
            <button
              onClick={() => { setFile(null); setBase64Str(""); }}
              className="text-sm text-grey hover:text-ink transition-colors"
            >
              Convert another file
            </button>
          </div>
          
          <FileListItem
            file={file}
            index={0}
            totalFiles={1}
            onRemove={() => { setFile(null); setBase64Str(""); }}
          />

          {isProcessing ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-sel" />
            </div>
          ) : base64Str ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-grey">Base64 Output</h4>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-ink text-paper rounded-[9px] shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover hover:bg-ink/90 transition-all text-sm font-medium"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              </div>

              <textarea
                readOnly
                value={base64Str}
                className="w-full h-48 bg-bg border border-ink/8 dark:border-white/10 rounded-[14px] p-4 text-grey code-mono text-xs focus:outline-none resize-none break-all"
              />
              <p className="text-xs text-grey">
                Length: {base64Str.length.toLocaleString()} characters
              </p>
            </div>
          ) : null}
        </div>
      )}
    </ToolWidgetShell>
  );
}
