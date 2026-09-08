"use client";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Download,
  Loader2,
  Files,
  Trash2,
  ArrowRight,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

type RenameMode = "sequence" | "prefix-suffix" | "replace" | "case";

export function BulkFileRenamerWidget() {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [mode, setMode] = useState<RenameMode>("sequence");

  // Sequential options
  const [seqPrefix, setSeqPrefix] = useState("file");
  const [seqStart, setSeqStart] = useState(1);
  const [seqPadding, setSeqPadding] = useState(3);

  // Prefix / Suffix options
  const [prefixText, setPrefixText] = useState("");
  const [suffixText, setSuffixText] = useState("");

  // Find & Replace options
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);

  // Case transform options
  const [caseType, setCaseType] = useState<"lower" | "upper" | "title" | "kebab" | "snake">("lower");

  const [keepExtension, setKeepExtension] = useState(true);
  const [isZipping, setIsZipping] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const newItems = acceptedFiles.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: f.size,
    }));
    setFiles((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // Calculate new names
  const renamedFiles = useMemo(() => {
    return files.map((item, index) => {
      const lastDotIndex = item.name.lastIndexOf(".");
      const hasExt = lastDotIndex !== -1;
      const baseName = hasExt ? item.name.substring(0, lastDotIndex) : item.name;
      const ext = hasExt ? item.name.substring(lastDotIndex) : "";

      let newBase = baseName;

      if (mode === "sequence") {
        const num = seqStart + index;
        const padded = String(num).padStart(seqPadding, "0");
        newBase = seqPrefix ? `${seqPrefix}_${padded}` : padded;
      } else if (mode === "prefix-suffix") {
        newBase = `${prefixText}${baseName}${suffixText}`;
      } else if (mode === "replace") {
        if (findText) {
          const flags = caseSensitive ? "g" : "gi";
          try {
            const regex = new RegExp(escapeRegExp(findText), flags);
            newBase = baseName.replace(regex, replaceText);
          } catch {
            newBase = baseName;
          }
        }
      } else if (mode === "case") {
        if (caseType === "lower") newBase = baseName.toLowerCase();
        else if (caseType === "upper") newBase = baseName.toUpperCase();
        else if (caseType === "title") {
          newBase = baseName.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
        } else if (caseType === "kebab") {
          newBase = baseName.replace(/\s+/g, "-").toLowerCase();
        } else if (caseType === "snake") {
          newBase = baseName.replace(/\s+/g, "_").toLowerCase();
        }
      }

      const finalName = keepExtension ? `${newBase}${ext}` : newBase;
      return {
        ...item,
        newName: finalName,
      };
    });
  }, [
    files,
    mode,
    seqPrefix,
    seqStart,
    seqPadding,
    prefixText,
    suffixText,
    findText,
    replaceText,
    caseSensitive,
    caseType,
    keepExtension,
  ]);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDownloadZip = async () => {
    if (files.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      renamedFiles.forEach((rf) => {
        zip.file(rf.newName, rf.file);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "renamed_files.zip");
    } catch (err) {
      console.error("Failed to build ZIP:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {files.length === 0 ? (
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
              <Files className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Choose files to bulk rename
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Drag & drop photos, documents, or data files here
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--paper)] border border-[var(--border)] text-[var(--ink-muted)]">
              Client-Side Fast Batch Renamer & ZIP Downloader
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center space-x-3 truncate">
              <Files className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div>
                <p className="font-semibold text-[var(--ink)]">{files.length} Files Selected</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  Total Size: {formatBytes(files.reduce((sum, f) => sum + f.size, 0))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div {...getRootProps()} className="inline-block">
                <input {...getInputProps()} />
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  + Add More Files
                </button>
              </div>

              <button
                onClick={() => setFiles([])}
                className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-red-500 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Renaming Pattern Rules
              </h4>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={keepExtension}
                  onChange={(e) => setKeepExtension(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--primary)]"
                />
                <span className="text-[var(--ink)] font-medium">Preserve file extensions</span>
              </label>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setMode("sequence")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  mode === "sequence"
                    ? "bg-[var(--paper)] border-[var(--primary)] text-[var(--ink)] shadow-sm"
                    : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Sequential Numbers
              </button>

              <button
                onClick={() => setMode("prefix-suffix")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  mode === "prefix-suffix"
                    ? "bg-[var(--paper)] border-[var(--primary)] text-[var(--ink)] shadow-sm"
                    : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Prefix / Suffix
              </button>

              <button
                onClick={() => setMode("replace")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  mode === "replace"
                    ? "bg-[var(--paper)] border-[var(--primary)] text-[var(--ink)] shadow-sm"
                    : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Find & Replace
              </button>

              <button
                onClick={() => setMode("case")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  mode === "case"
                    ? "bg-[var(--paper)] border-[var(--primary)] text-[var(--ink)] shadow-sm"
                    : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Case Transform
              </button>
            </div>

            {/* Mode Settings Form */}
            <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              {mode === "sequence" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                      Filename Prefix
                    </label>
                    <input
                      type="text"
                      value={seqPrefix}
                      onChange={(e) => setSeqPrefix(e.target.value)}
                      placeholder="e.g. photo, doc, invoice"
                      className="w-full text-xs p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                      Start Number
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={seqStart}
                      onChange={(e) => setSeqStart(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                      Zero Padding
                    </label>
                    <select
                      value={seqPadding}
                      onChange={(e) => setSeqPadding(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                    >
                      <option value={1}>1 (e.g. file_1)</option>
                      <option value={2}>2 (e.g. file_01)</option>
                      <option value={3}>3 (e.g. file_001)</option>
                      <option value={4}>4 (e.g. file_0001)</option>
                    </select>
                  </div>
                </div>
              )}

              {mode === "prefix-suffix" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                      Add Prefix (at beginning)
                    </label>
                    <input
                      type="text"
                      value={prefixText}
                      onChange={(e) => setPrefixText(e.target.value)}
                      placeholder="e.g. [2026]_"
                      className="w-full text-xs p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                      Add Suffix (at end before extension)
                    </label>
                    <input
                      type="text"
                      value={suffixText}
                      onChange={(e) => setSuffixText(e.target.value)}
                      placeholder="e.g. _final"
                      className="w-full text-xs p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                    />
                  </div>
                </div>
              )}

              {mode === "replace" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                        Find Text
                      </label>
                      <input
                        type="text"
                        value={findText}
                        onChange={(e) => setFindText(e.target.value)}
                        placeholder="Text to replace..."
                        className="w-full text-xs p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                        Replace With
                      </label>
                      <input
                        type="text"
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        placeholder="Replacement text..."
                        className="w-full text-xs p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs pt-1">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[var(--primary)]"
                    />
                    <span className="text-[var(--ink-muted)]">Match Case Exactly</span>
                  </label>
                </div>
              )}

              {mode === "case" && (
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "lower", label: "lowercase" },
                    { id: "upper", label: "UPPERCASE" },
                    { id: "title", label: "Title Case" },
                    { id: "kebab", label: "kebab-case" },
                    { id: "snake", label: "snake_case" },
                  ].map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setCaseType(ct.id as typeof caseType)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        caseType === ct.id
                          ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] font-semibold"
                          : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Live Preview List */}
          <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] border-b border-[var(--border)] pb-2">
              <span>Previewing {renamedFiles.length} Renamed Files</span>
              <span>Click any delete button to exclude a file</span>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {renamedFiles.map((rf) => (
                <div
                  key={rf.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border)] bg-[var(--paper)] gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 truncate flex-1">
                    <span className="text-[var(--ink-muted)] truncate max-w-[200px]" title={rf.name}>
                      {rf.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                    <span className="font-semibold text-[var(--ink)] truncate" title={rf.newName}>
                      {rf.newName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[var(--ink-muted)] font-mono">{formatBytes(rf.size)}</span>
                    <button
                      onClick={() => removeFile(rf.id)}
                      className="p-1 text-[var(--ink-muted)] hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--ink-muted)] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                All renamed files will be bundled into a compressed ZIP package.
              </div>

              <button
                onClick={handleDownloadZip}
                disabled={isZipping || files.length === 0}
                className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 text-sm shadow-sm"
              >
                {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download Renamed (.ZIP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
