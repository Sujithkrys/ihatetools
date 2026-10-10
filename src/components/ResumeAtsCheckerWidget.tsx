"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as pdfjsLib from "pdfjs-dist";
import { FileText, Loader2, AlertTriangle, ClipboardPaste, UploadCloud, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreReportCard } from "@/components/ScoreReportCard";
import { runAtsCheck, type AtsCheckResult } from "@/lib/atsCheck";

if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // @ts-expect-error item.str is part of TextItem
    const strings = textContent.items.map((item) => item.str);
    fullText += strings.join(" ") + "\n";
  }
  return fullText.trim();
}

export function ResumeAtsCheckerWidget() {
  const [resumeMode, setResumeMode] = useState<"paste" | "upload">("paste");
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [noTextWarning, setNoTextWarning] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<AtsCheckResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setResumeFileName(file.name);
    setIsExtracting(true);
    setNoTextWarning(false);
    try {
      const text = await extractPdfText(file);
      if (text.length === 0) {
        setNoTextWarning(true);
        setResumeText("");
      } else {
        setResumeText(text);
      }
    } catch {
      setNoTextWarning(true);
      setResumeText("");
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const canAnalyze = resumeText.trim().length > 20 && jobText.trim().length > 20;

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    setResult(runAtsCheck(resumeText, jobText));
  };

  const handleReset = () => {
    setResult(null);
    setResumeText("");
    setResumeFileName("");
    setNoTextWarning(false);
    setJobText("");
  };

  if (result) {
    const findings = [
      ...result.sections.map((s) => ({
        status: (s.found ? "pass" : "warn") as "pass" | "warn",
        title: s.found ? `${s.label} section detected` : `No clear "${s.label}" section heading found`,
        detail: s.found
          ? undefined
          : "Standard headings help parsers file your content under the right category.",
      })),
      {
        status: (result.contact.email ? "pass" : "fail") as "pass" | "fail",
        title: result.contact.email ? "Email address found" : "No email address detected",
        detail: result.contact.email ? undefined : "Most systems need a machine-readable email in the body text.",
      },
      {
        status: (result.contact.phone ? "pass" : "warn") as "pass" | "warn",
        title: result.contact.phone ? "Phone number found" : "No phone number detected",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-[10px] border-[1.5px] border-yellow/60 bg-yellow/10 p-4">
          <AlertTriangle className="w-5 h-5 text-yellow shrink-0 mt-0.5" />
          <p className="text-sm text-ink leading-relaxed">
            <strong>This is a keyword and formatting check, not a real ATS simulation.</strong>{" "}
            Every company uses different hiring software with its own private rules. Treat this
            as suggestions to review, never as a guarantee of how any specific employer will
            score your resume.
          </p>
        </div>

        <ScoreReportCard
          scoreLabel="Keyword Match"
          scoreValue={result.matchScore}
          segments={[
            { label: "Matched", value: result.matched.length, color: "bg-green" },
            { label: "Missing", value: result.missing.length, color: "bg-pink" },
          ]}
          findings={findings}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-[1.5px] border-ink/15 rounded-[10px] p-4">
            <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green" /> Matched keywords ({result.matched.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {result.matched.length === 0 && <p className="text-xs text-grey">None found.</p>}
              {result.matched.map((term) => (
                <span key={term} className="text-xs px-2 py-1 rounded-full bg-green/10 text-ink border border-green/30">
                  {term}
                </span>
              ))}
            </div>
          </div>
          <div className="border-[1.5px] border-ink/15 rounded-[10px] p-4">
            <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-pink" /> Missing keywords ({result.missing.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {result.missing.length === 0 && <p className="text-xs text-grey">None, great coverage.</p>}
              {result.missing.map((term) => (
                <span key={term} className="text-xs px-2 py-1 rounded-full bg-pink/10 text-ink border border-pink/30">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3 rounded-[8px] border-[1.5px] border-ink text-ink font-medium hover:bg-ink/5 transition-colors"
        >
          Check another resume
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setResumeMode("paste")}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border-[1.5px]",
              resumeMode === "paste" ? "bg-ink text-paper border-ink" : "border-ink/20 text-grey"
            )}
          >
            Paste resume text
          </button>
          <button
            onClick={() => setResumeMode("upload")}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border-[1.5px]",
              resumeMode === "upload" ? "bg-ink text-paper border-ink" : "border-ink/20 text-grey"
            )}
          >
            Upload PDF
          </button>
        </div>

        {resumeMode === "paste" ? (
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full h-48 bg-bg border border-ink/15 rounded-[8px] p-4 text-ink text-sm focus:outline-none resize-none"
          />
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-[10px] p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-ink bg-ink/5" : "border-ink/20 hover:border-ink/40"
            )}
          >
            <input {...getInputProps()} />
            {isExtracting ? (
              <Loader2 className="w-6 h-6 text-grey animate-spin mx-auto" />
            ) : resumeText && resumeFileName ? (
              <div className="flex flex-col items-center gap-1">
                <FileText className="w-6 h-6 text-ink" />
                <p className="text-sm text-ink font-medium">{resumeFileName}</p>
                <p className="text-xs text-grey">Click or drop to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <UploadCloud className="w-6 h-6 text-grey" />
                <p className="text-sm text-ink font-medium">Drag & drop your resume PDF</p>
                <p className="text-xs text-grey">or click to browse. Have a .docx? Paste its text instead.</p>
              </div>
            )}
          </div>
        )}

        {noTextWarning && (
          <p className="mt-2 text-xs text-pink flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            No selectable text found in this PDF. If it is a scanned or image-based resume, most ATS
            software cannot read it at all, try our <a href="/tools/ocr-pdf" className="underline">OCR tool</a> first.
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-ink">
          <ClipboardPaste className="w-4 h-4" /> Paste the job description
        </div>
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste the full job posting here..."
          className="w-full h-48 bg-bg border border-ink/15 rounded-[8px] p-4 text-ink text-sm focus:outline-none resize-none"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        className="w-full py-3 rounded-[8px] bg-ink text-paper font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink/90 transition-colors"
      >
        Analyze match
      </button>
    </div>
  );
}
