"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { FileListItem } from "@/components/FileListItem";
import { cn } from "@/lib/utils";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";

export function AddPasswordWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: import("react-dropzone").FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMsg("Please upload a valid PDF file.");
    } else {
      setErrorMsg("");
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > 4.2 * 1024 * 1024) {
        setErrorMsg("Files over 4MB aren't supported yet for this tool.");
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleEncryptPdf = async () => {
    if (!file) return;
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length === 0) {
      setErrorMsg("Password cannot be empty.");
      return;
    }
    
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch("/api/add-password", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadFilename(`encrypted-${file.name}`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message || "An error occurred while encrypting the PDF.");
      } else {
        setErrorMsg("An error occurred while encrypting the PDF.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setErrorMsg("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const isReady = file !== null && password !== "" && password === confirmPassword;

  return (
    <ToolWidgetShell>
      {!downloadUrl && !isProcessing && (
        <div className="space-y-6">
          {!file ? (
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
                  <Lock className="w-6 h-6 text-grey" />
                </div>
                <div>
                  <p className="text-lg font-medium text-ink">Drag & drop a PDF here</p>
                  <p className="text-sm text-grey mt-1">Maximum file size: 4MB</p>
                </div>
                <button className="mt-2 px-5 py-2.5 bg-ink text-paper rounded-[9px] text-[13.5px] font-medium shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all">
                  Browse files
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-paper rounded-[16px] border border-ink/8 dark:border-white/10 shadow-soft dark:shadow-soft-dark p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-ink font-medium">Selected PDF</h3>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-grey hover:text-ink transition-colors"
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

              <div className="mt-8 space-y-4 max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-grey mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-bg border border-ink/8 dark:border-white/10 rounded-[14px] px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-sel/50 pr-10"
                        placeholder="Enter password"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-ink"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-bg border border-ink/8 dark:border-white/10 rounded-[14px] px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-sel/50 pr-10"
                        placeholder="Confirm password"
                      />
                      <button 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-ink"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleEncryptPdf}
                    disabled={!isReady}
                    className="px-4 py-2 bg-ink text-paper rounded-[10px] shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Protect PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMsg && <p className="text-pink text-sm text-center">{errorMsg}</p>}
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-sel animate-spin mb-4" />
          <p className="text-ink font-medium">Encrypting PDF... (this may take a moment)</p>
        </div>
      )}

      {downloadUrl && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-sel/20 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-sel" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">PDF Password Protected!</h3>
            <p className="text-grey mt-2">Your PDF is now securely encrypted with AES-256.</p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="px-8 py-3 bg-ink text-paper rounded-[10px] shadow-soft dark:shadow-soft-dark hover:-translate-y-[1px] hover:shadow-soft-hover transition-all font-medium text-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Secure PDF
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-grey hover:text-ink underline underline-offset-4 text-sm mt-4"
          >
            Protect another PDF
          </button>
        </div>
      )}
    </ToolWidgetShell>
  );
}
