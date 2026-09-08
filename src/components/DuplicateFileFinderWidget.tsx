"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Loader2,
  Trash2,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  Files,
} from "lucide-react";

interface HashedFileItem {
  id: string;
  name: string;
  size: number;
  hash: string;
  file: File;
}

interface DuplicateGroup {
  hash: string;
  files: HashedFileItem[];
  totalSize: number;
  wastedSize: number;
}

export function DuplicateFileFinderWidget() {
  const [files, setFiles] = useState<HashedFileItem[]>([]);
  const [isHashing, setIsHashing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);

  // Compute SHA-256 hash using Web Crypto API
  const hashFile = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    setIsHashing(true);
    setTotalToProcess(acceptedFiles.length);
    setProcessedCount(0);

    const hashedItems: HashedFileItem[] = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      const f = acceptedFiles[i];
      try {
        const hash = await hashFile(f);
        hashedItems.push({
          id: Math.random().toString(36).substring(2, 9),
          name: f.name,
          size: f.size,
          hash,
          file: f,
        });
      } catch (err) {
        console.error("Hashing failed for:", f.name, err);
      }
      setProcessedCount(i + 1);
    }

    setFiles((prev) => [...prev, ...hashedItems]);
    setIsHashing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // Group files by SHA-256 hash
  const hashGroups: Record<string, HashedFileItem[]> = {};
  files.forEach((f) => {
    if (!hashGroups[f.hash]) hashGroups[f.hash] = [];
    hashGroups[f.hash].push(f);
  });

  const duplicateGroups: DuplicateGroup[] = [];
  const uniqueFiles: HashedFileItem[] = [];

  Object.entries(hashGroups).forEach(([hash, groupFiles]) => {
    if (groupFiles.length > 1) {
      const itemSize = groupFiles[0].size;
      duplicateGroups.push({
        hash,
        files: groupFiles,
        totalSize: itemSize * groupFiles.length,
        wastedSize: itemSize * (groupFiles.length - 1),
      });
    } else {
      uniqueFiles.push(groupFiles[0]);
    }
  });

  const totalDuplicatesCount = duplicateGroups.reduce(
    (sum, g) => sum + (g.files.length - 1),
    0
  );
  const totalWastedBytes = duplicateGroups.reduce((sum, g) => sum + g.wastedSize, 0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
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
                Scan multiple files for exact duplicates
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Drag & drop any collection of files to compute client-side cryptographic SHA-256 hashes
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% On-Device Hashing • Zero Server Upload
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center space-x-3">
              <FileCheck className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <p className="font-semibold text-[var(--ink)]">
                  {files.length} Files Scanned
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {duplicateGroups.length} duplicate group{duplicateGroups.length === 1 ? "" : "s"} detected
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
                onClick={clearAll}
                className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-red-500 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          {/* Hashing progress */}
          {isHashing && (
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <div className="flex justify-between text-xs text-[var(--ink)] font-semibold">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" />
                  Hashing files ({processedCount} / {totalToProcess})...
                </span>
                <span>{Math.round((processedCount / totalToProcess) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all"
                  style={{ width: `${(processedCount / totalToProcess) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Duplicate Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="text-xs text-[var(--ink-muted)]">Total Duplicates Found</div>
              <div className="text-xl font-bold text-[var(--ink)] mt-1">
                {totalDuplicatesCount} files
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="text-xs text-[var(--ink-muted)]">Duplicate Groups</div>
              <div className="text-xl font-bold text-[var(--ink)] mt-1">
                {duplicateGroups.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="text-xs text-[var(--ink-muted)]">Wasted Storage Space</div>
              <div className="text-xl font-bold text-red-500 mt-1">
                {formatBytes(totalWastedBytes)}
              </div>
            </div>
          </div>

          {/* Duplicate Groups List */}
          {duplicateGroups.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                Identified Duplicate Clusters ({duplicateGroups.length})
              </h4>

              {duplicateGroups.map((group, groupIdx) => (
                <div
                  key={group.hash}
                  className="p-5 rounded-xl bg-[var(--surface)] border border-amber-500/30 dark:border-amber-500/20 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center">
                        #{groupIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-[var(--ink)]">
                        {group.files.length} Identical Copies
                      </span>
                      <span className="text-[11px] text-[var(--ink-muted)] font-mono">
                        ({formatBytes(group.files[0].size)} each)
                      </span>
                    </div>

                    <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      Wasting {formatBytes(group.wastedSize)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.files.map((fileItem, fIdx) => (
                      <div
                        key={fileItem.id}
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                          fIdx === 0
                            ? "bg-[var(--paper)] border-[var(--border)]"
                            : "bg-red-50/50 dark:bg-red-950/20 border-red-200/60 dark:border-red-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate flex-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              fIdx === 0
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {fIdx === 0 ? "Original" : "Duplicate"}
                          </span>
                          <span className="font-medium text-[var(--ink)] truncate" title={fileItem.name}>
                            {fileItem.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                            {formatBytes(fileItem.size)}
                          </span>
                          <button
                            onClick={() => removeFile(fileItem.id)}
                            className="p-1 text-[var(--ink-muted)] hover:text-red-500 transition-colors"
                            title="Remove from list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] font-mono text-[var(--ink-muted)] truncate pt-1 opacity-80">
                    SHA-256: {group.hash}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-[var(--ink)] text-base">No Duplicates Found</h4>
              <p className="text-xs text-[var(--ink-muted)]">
                All {files.length} uploaded files have distinct, unique cryptographic signatures.
              </p>
            </div>
          )}

          {/* Unique files list */}
          {uniqueFiles.length > 0 && duplicateGroups.length > 0 && (
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-semibold text-[var(--ink-muted)]">
                Unique Files ({uniqueFiles.length}):
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {uniqueFiles.map((uf) => (
                  <span
                    key={uf.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--paper)] border border-[var(--border)] text-xs text-[var(--ink)]"
                  >
                    {uf.name} ({formatBytes(uf.size)})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
