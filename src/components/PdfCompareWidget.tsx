"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as pdfjsLib from "pdfjs-dist";
import * as diff from "diff";
import {
  GitCompare,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCw,
  Plus,
  Minus,
} from "lucide-react";

// Configure worker
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface PdfDocInfo {
  file: File;
  text: string;
  numPages: number;
}

export function PdfCompareWidget() {
  const [doc1, setDoc1] = useState<PdfDocInfo | null>(null);
  const [doc2, setDoc2] = useState<PdfDocInfo | null>(null);

  const [isExtracting1, setIsExtracting1] = useState(false);
  const [isExtracting2, setIsExtracting2] = useState(false);
  const [diffMode, setDiffMode] = useState<"lines" | "words">("lines");

  const [diffResult, setDiffResult] = useState<diff.Change[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const extractTextFromPdf = async (file: File): Promise<{ text: string; numPages: number }> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // @ts-expect-error text item str
      const strings = textContent.items.map((item) => item.str);
      if (strings.length > 0) {
        fullText += strings.join(" ") + "\n";
      }
    }
    return { text: fullText, numPages: pdf.numPages };
  };

  const onDropDoc1 = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsExtracting1(true);
    setErrorMsg("");
    setDiffResult(null);

    try {
      const { text, numPages } = await extractTextFromPdf(file);
      setDoc1({ file, text, numPages });
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to extract text from Document 1.");
    } finally {
      setIsExtracting1(false);
    }
  }, []);

  const onDropDoc2 = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsExtracting2(true);
    setErrorMsg("");
    setDiffResult(null);

    try {
      const { text, numPages } = await extractTextFromPdf(file);
      setDoc2({ file, text, numPages });
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to extract text from Document 2.");
    } finally {
      setIsExtracting2(false);
    }
  }, []);

  const dropzone1 = useDropzone({
    onDrop: onDropDoc1,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const dropzone2 = useDropzone({
    onDrop: onDropDoc2,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleCompare = () => {
    if (!doc1 || !doc2) return;
    setErrorMsg("");

    if (!doc1.text.trim() && !doc2.text.trim()) {
      setErrorMsg(
        "Both documents contained no extractable digital text. Scanned or image-only PDFs require OCR text extraction first."
      );
      return;
    }

    let differences: diff.Change[];
    if (diffMode === "lines") {
      differences = diff.diffLines(doc1.text, doc2.text);
    } else {
      differences = diff.diffWords(doc1.text, doc2.text);
    }
    setDiffResult(differences);
  };

  const resetAll = () => {
    setDoc1(null);
    setDoc2(null);
    setDiffResult(null);
    setErrorMsg("");
  };

  // Compute diff statistics
  const additions = diffResult?.filter((c) => c.added).length || 0;
  const deletions = diffResult?.filter((c) => c.removed).length || 0;
  const hasNoChanges = diffResult && additions === 0 && deletions === 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Scope Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3 text-xs text-[var(--ink-muted)] leading-relaxed">
        <Info className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--ink)]">Text-Content Comparison Scope:</strong> This tool
          compares the digital text streams and wording between two PDF documents. It does not perform
          visual pixel, kerning, or raster graphic diffing.
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Dual Document Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A (Original) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)]">
            <span>Original Document (Version A)</span>
            {doc1 && (
              <span className="text-[var(--ink-muted)]">
                {doc1.numPages} page{doc1.numPages === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {!doc1 ? (
            <div
              {...dropzone1.getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all min-h-[160px] flex flex-col items-center justify-center ${
                dropzone1.isDragActive
                  ? "border-[var(--primary)] bg-[var(--surface-hover)]"
                  : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--surface)]"
              }`}
            >
              <input {...dropzone1.getInputProps()} />
              {isExtracting1 ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  <span className="text-xs text-[var(--ink-muted)]">Extracting text...</span>
                </div>
              ) : (
                <>
                  <FileText className="w-8 h-8 text-[var(--primary)] mb-2" />
                  <p className="text-sm font-bold text-[var(--ink)]">Drop Original PDF</p>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">or click to browse</p>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <FileText className="w-5 h-5 text-[var(--primary)] shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{doc1.file.name}</p>
                  <p className="text-xs text-[var(--ink-muted)] font-mono">
                    {doc1.text.length} characters extracted
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDoc1(null)}
                className="text-xs text-[var(--ink-muted)] hover:text-red-500 font-medium shrink-0"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Document B (Modified) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)]">
            <span>Revised Document (Version B)</span>
            {doc2 && (
              <span className="text-[var(--ink-muted)]">
                {doc2.numPages} page{doc2.numPages === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {!doc2 ? (
            <div
              {...dropzone2.getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all min-h-[160px] flex flex-col items-center justify-center ${
                dropzone2.isDragActive
                  ? "border-[var(--primary)] bg-[var(--surface-hover)]"
                  : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--surface)]"
              }`}
            >
              <input {...dropzone2.getInputProps()} />
              {isExtracting2 ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
                  <span className="text-xs text-[var(--ink-muted)]">Extracting text...</span>
                </div>
              ) : (
                <>
                  <FileText className="w-8 h-8 text-[var(--primary)] mb-2" />
                  <p className="text-sm font-bold text-[var(--ink)]">Drop Revised PDF</p>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">or click to browse</p>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <FileText className="w-5 h-5 text-[var(--primary)] shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{doc2.file.name}</p>
                  <p className="text-xs text-[var(--ink-muted)] font-mono">
                    {doc2.text.length} characters extracted
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDoc2(null)}
                className="text-xs text-[var(--ink-muted)] hover:text-red-500 font-medium shrink-0"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[var(--ink)]">Diff Granularity:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setDiffMode("lines")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                diffMode === "lines"
                  ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                  : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Line-by-Line
            </button>
            <button
              onClick={() => setDiffMode("words")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                diffMode === "words"
                  ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                  : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Word-by-Word
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAll}
            className="px-3 py-2 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear
          </button>

          <button
            onClick={handleCompare}
            disabled={!doc1 || !doc2}
            className="px-6 py-2 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 text-sm shadow-sm"
          >
            <GitCompare className="w-4 h-4" /> Compare PDFs
          </button>
        </div>
      </div>

      {/* Diff Output Display */}
      {diffResult && (
        <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-sm text-[var(--ink)]">Comparison Results</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Plus className="w-3.5 h-3.5" /> {additions} additions
              </span>
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                <Minus className="w-3.5 h-3.5" /> {deletions} deletions
              </span>
            </div>

            {hasNoChanges && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Documents are 100% Identical in Text Content
              </span>
            )}
          </div>

          {/* Monospace Code Diff View */}
          <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
            {diffResult.map((part, index) => {
              if (part.added) {
                return (
                  <span
                    key={index}
                    className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium px-0.5 rounded"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.removed) {
                return (
                  <span
                    key={index}
                    className="bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 line-through px-0.5 rounded"
                  >
                    {part.value}
                  </span>
                );
              }
              return <span key={index} className="text-[var(--ink)] opacity-70">{part.value}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
