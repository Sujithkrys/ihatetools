"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Download,
  Loader2,
  RefreshCw,
  Minimize2,
  Music,
  AlertCircle,
  Volume2,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  decodeAudioData,
  audioBufferToMp3,
  formatTime,
  formatBytes,
} from "@/lib/audio-utils";

type CompressionPreset = "high" | "voice" | "extreme" | "custom";

export function AudioCompressorWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [preset, setPreset] = useState<CompressionPreset>("voice");
  const [customBitrate, setCustomBitrate] = useState(96);
  const [downmixMono, setDownmixMono] = useState(true);

  const [isDecoding, setIsDecoding] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const uploaded = acceptedFiles[0];
    setFile(uploaded);
    setErrorMsg("");
    setCompressedUrl(null);
    setCompressedSize(null);
    setIsDecoding(true);

    try {
      const { buffer, audioCtx } = await decodeAudioData(uploaded);
      setAudioBuffer(buffer);
      audioCtx.close();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to decode audio. Please ensure the file is an uncorrupted audio track.");
    } finally {
      setIsDecoding(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav", ".ogg", ".aac", ".m4a", ".flac", ".webm"] },
    multiple: false,
  });

  const getTargetBitrate = (): number => {
    switch (preset) {
      case "high":
        return 128;
      case "voice":
        return 64;
      case "extreme":
        return 32;
      case "custom":
        return customBitrate;
    }
  };

  const handleCompress = async () => {
    if (!audioBuffer) return;
    setIsCompressing(true);
    setErrorMsg("");

    try {
      const bitrate = getTargetBitrate();

      // If mono downmixing is enabled and buffer is stereo, create mono buffer
      let processBuffer = audioBuffer;
      if (downmixMono && audioBuffer.numberOfChannels > 1) {
        const AudioContextClass =
          window.AudioContext ||
          // @ts-expect-error webkitAudioContext fallback
          window.webkitAudioContext;
        const ctx = new AudioContextClass();
        const mono = ctx.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
        const left = audioBuffer.getChannelData(0);
        const right = audioBuffer.getChannelData(1);
        const monoData = mono.getChannelData(0);
        for (let i = 0; i < audioBuffer.length; i++) {
          monoData[i] = (left[i] + right[i]) * 0.5;
        }
        processBuffer = mono;
        ctx.close();
      }

      const outputBlob = audioBufferToMp3(processBuffer, bitrate);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      const url = URL.createObjectURL(outputBlob);
      setCompressedUrl(url);
      setCompressedSize(outputBlob.size);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setAudioBuffer(null);
    setErrorMsg("");
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setCompressedUrl(null);
    setCompressedSize(null);
  };

  // Honesty standard: calculate real reduction
  const originalSize = file?.size || 0;
  const isReduced = compressedSize !== null && compressedSize < originalSize;
  const savingsBytes = isReduced && compressedSize !== null ? originalSize - compressedSize : 0;
  const savingsPercent =
    isReduced && originalSize > 0 && compressedSize !== null
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : "0";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!file ? (
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
              <Minimize2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Select an audio file to compress
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Reduce audio file size with intelligent bitrate & channel optimization
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--paper)] border border-[var(--border)] text-[var(--ink-muted)]">
              No Quality Gimmicks • Honest Real-World File Sizes
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center space-x-3 truncate">
              <Music className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-[var(--ink)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  Original: <strong>{formatBytes(file.size)}</strong> • {audioBuffer ? formatTime(audioBuffer.duration) : "..."} • {audioBuffer?.numberOfChannels === 1 ? "Mono" : "Stereo"}
                </p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Select Another
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isDecoding ? (
            <div className="p-12 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
              <p className="mt-3 text-sm text-[var(--ink-muted)]">Reading audio samples...</p>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              {/* Presets */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[var(--ink)]">Compression Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setPreset("high");
                      setDownmixMono(false);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      preset === "high"
                        ? "border-[var(--primary)] bg-[var(--paper)] shadow-sm ring-1 ring-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--paper)]/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-[var(--ink)]">Standard Music</div>
                    <div className="text-xs text-[var(--ink-muted)] mt-1">128 kbps • Stereo</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">Crisp fidelity</div>
                  </button>

                  <button
                    onClick={() => {
                      setPreset("voice");
                      setDownmixMono(true);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      preset === "voice"
                        ? "border-[var(--primary)] bg-[var(--paper)] shadow-sm ring-1 ring-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--paper)]/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-[var(--ink)]">Voice / Podcast</div>
                    <div className="text-xs text-[var(--ink-muted)] mt-1">64 kbps • Mono</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">Recommended for speech</div>
                  </button>

                  <button
                    onClick={() => {
                      setPreset("extreme");
                      setDownmixMono(true);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      preset === "extreme"
                        ? "border-[var(--primary)] bg-[var(--paper)] shadow-sm ring-1 ring-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--paper)]/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-[var(--ink)]">Maximum Shrink</div>
                    <div className="text-xs text-[var(--ink-muted)] mt-1">32 kbps • Mono</div>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-2">Voice notes & recordings</div>
                  </button>

                  <button
                    onClick={() => setPreset("custom")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      preset === "custom"
                        ? "border-[var(--primary)] bg-[var(--paper)] shadow-sm ring-1 ring-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--paper)]/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-[var(--ink)]">Custom Bitrate</div>
                    <div className="text-xs text-[var(--ink-muted)] mt-1">{customBitrate} kbps</div>
                    <div className="text-[11px] text-[var(--ink-muted)] mt-2">Fine-tuned control</div>
                  </button>
                </div>

                {/* Custom Options */}
                {preset === "custom" && (
                  <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--ink)]">Bitrate: {customBitrate} kbps</span>
                      <span className="text-[var(--ink-muted)]">32 kbps to 192 kbps</span>
                    </div>
                    <input
                      type="range"
                      min="32"
                      max="192"
                      step="16"
                      value={customBitrate}
                      onChange={(e) => setCustomBitrate(Number(e.target.value))}
                      className="w-full accent-[var(--primary)]"
                    />
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={downmixMono}
                        onChange={(e) => setDownmixMono(e.target.checked)}
                        className="w-4 h-4 rounded text-[var(--primary)]"
                      />
                      <span className="text-xs text-[var(--ink)]">
                        Downmix stereo channels to mono (cuts file size nearly in half)
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                <div className="text-xs text-[var(--ink-muted)]">
                  Target Bitrate: <strong>{getTargetBitrate()} kbps</strong> ({downmixMono ? "Mono" : "Stereo"})
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 text-sm"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Compressing Audio...
                      </>
                    ) : (
                      <>
                        <Minimize2 className="w-4 h-4" />
                        Compress Audio
                      </>
                    )}
                  </button>

                  {compressedUrl && (
                    <a
                      href={compressedUrl}
                      download={`compressed_${file.name.replace(/\.[^/.]+$/, "")}.mp3`}
                      className="px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download ({formatBytes(compressedSize || 0)})
                    </a>
                  )}
                </div>
              </div>

              {/* Honesty Standard Results Card */}
              {compressedSize !== null && (
                <div className="p-5 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      Compression Audit
                    </span>
                    {isReduced ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Saved {savingsPercent}% ({formatBytes(savingsBytes)} reduction)
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" /> Negligible size change
                      </span>
                    )}
                  </div>

                  {/* Size Comparison Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-[var(--ink-muted)]">Original Size</div>
                      <div className="text-base font-bold text-[var(--ink)] mt-0.5">
                        {formatBytes(originalSize)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[var(--ink-muted)]">Compressed Size</div>
                      <div className="text-base font-bold text-[var(--primary)] mt-0.5">
                        {formatBytes(compressedSize)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[var(--ink-muted)]">Net Savings</div>
                      <div className={`text-base font-bold mt-0.5 ${isReduced ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--ink-muted)]"}`}>
                        {isReduced ? `-${savingsPercent}%` : "0%"}
                      </div>
                    </div>
                  </div>

                  {!isReduced && (
                    <p className="text-xs text-[var(--ink-muted)] bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)]">
                      <strong>Honest Disclosure:</strong> The original audio file was already compressed at or below the selected bitrate ({getTargetBitrate()} kbps). Re-encoding cannot compress it further without significant distortion.
                    </p>
                  )}

                  {/* Audition Player */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs text-[var(--ink-muted)] flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" /> Audition compressed audio quality:
                    </label>
                    <audio controls src={compressedUrl || undefined} className="w-full h-10 rounded" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
