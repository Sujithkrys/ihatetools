"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import SparkMD5 from "spark-md5";
import {
  Hash,
  Copy,
  Check,
  FileCode,
  Upload,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ComputedHashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export function HashGeneratorWidget() {
  const [tab, setTab] = useState<"text" | "file">("text");
  const [inputText, setInputText] = useState("Hello, World!");
  const [file, setFile] = useState<File | null>(null);

  const [hashes, setHashes] = useState<ComputedHashes>({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
  });

  const [uppercase, setUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [compareHash, setCompareHash] = useState("");

  const computeHashesFromBuffer = async (buffer: ArrayBuffer): Promise<ComputedHashes> => {
    // 1. MD5
    const md5 = SparkMD5.ArrayBuffer.hash(buffer);

    // 2. SHA-1
    const sha1Buf = await crypto.subtle.digest("SHA-1", buffer);
    const sha1 = Array.from(new Uint8Array(sha1Buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 3. SHA-256
    const sha256Buf = await crypto.subtle.digest("SHA-256", buffer);
    const sha256 = Array.from(new Uint8Array(sha256Buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 4. SHA-512
    const sha512Buf = await crypto.subtle.digest("SHA-512", buffer);
    const sha512 = Array.from(new Uint8Array(sha512Buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return { md5, sha1, sha256, sha512 };
  };

  // Compute text hashes
  const computeTextHashes = useCallback(async () => {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(inputText).buffer;
    const res = await computeHashesFromBuffer(buffer);
    setHashes(res);
  }, [inputText]);

  useEffect(() => {
    if (tab === "text") {
      computeTextHashes();
    }
  }, [tab, computeTextHashes]);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const uploaded = acceptedFiles[0];
    setFile(uploaded);
    const buffer = await uploaded.arrayBuffer();
    const res = await computeHashesFromBuffer(buffer);
    setHashes(res);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleCopy = async (val: string, key: string) => {
    if (!val) return;
    try {
      const formatted = uppercase ? val.toUpperCase() : val.toLowerCase();
      await navigator.clipboard.writeText(formatted);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  const formatHash = (h: string) => (uppercase ? h.toUpperCase() : h.toLowerCase());

  // Comparison verification
  const trimmedCompare = compareHash.trim().toLowerCase();
  const matchedAlgorithm = Object.entries(hashes).find(
    ([, h]) => h.toLowerCase() === trimmedCompare && trimmedCompare.length > 0
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setTab("text")}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            tab === "text"
              ? "border-[var(--ink)] text-[var(--ink)]"
              : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <FileCode className="w-4 h-4" /> Text Input
        </button>

        <button
          onClick={() => setTab("file")}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            tab === "file"
              ? "border-[var(--ink)] text-[var(--ink)]"
              : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <Upload className="w-4 h-4" /> File Checksum
        </button>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
        {tab === "text" ? (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] block mb-2">
              String to Hash
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type any text to calculate cryptographic checksums..."
              className="w-full text-sm font-mono p-3 bg-[var(--paper)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
            />
          </div>
        ) : (
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-[var(--primary)] bg-[var(--surface-hover)]"
                  : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--paper)]"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Hash className="w-8 h-8 text-[var(--primary)]" />
                <p className="text-sm font-bold text-[var(--ink)]">
                  {file ? file.name : "Select or drop any file to compute checksums"}
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB • Click to change file`
                    : "Processes any file size locally in your browser"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--primary)]"
            />
            <span className="text-[var(--ink)] font-medium">UPPERCASE Hex</span>
          </label>

          <span className="text-xs text-[var(--ink-muted)] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Client-Side Cryptography
          </span>
        </div>
      </div>

      {/* Generated Hashes List */}
      <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
          Calculated Cryptographic Checksums
        </h4>

        {[
          { key: "md5", name: "MD5 (128-bit)" },
          { key: "sha1", name: "SHA-1 (160-bit)" },
          { key: "sha256", name: "SHA-256 (256-bit)" },
          { key: "sha512", name: "SHA-512 (512-bit)" },
        ].map(({ key, name }) => {
          const val = hashes[key as keyof ComputedHashes];
          return (
            <div
              key={key}
              className="p-3.5 rounded-lg bg-[var(--paper)] border border-[var(--border)] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink)]">{name}</span>
                <button
                  onClick={() => handleCopy(val, key)}
                  className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {copiedKey === key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedKey === key ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="font-mono text-xs text-[var(--ink)] break-all select-all">
                {formatHash(val) || "..."}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checksum Verification Box */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
        <label className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider block">
          Compare & Verify Expected Checksum
        </label>
        <input
          type="text"
          value={compareHash}
          onChange={(e) => setCompareHash(e.target.value)}
          placeholder="Paste expected MD5, SHA-1, or SHA-256 hash to verify match..."
          className="w-full text-xs font-mono p-2.5 bg-[var(--paper)] border border-[var(--border)] rounded-lg text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
        />

        {compareHash.trim() && (
          <div className="pt-1">
            {matchedAlgorithm ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Checksum Verified: Exact match with {matchedAlgorithm[0].toUpperCase()}!
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
                <XCircle className="w-4 h-4" />
                Checksum Mismatch: No calculated hash matches the pasted string.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
