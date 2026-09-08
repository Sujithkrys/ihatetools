"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Download,
  Loader2,
  RefreshCw,
  Repeat,
  Music,
  AlertCircle,
  Volume2,
  CheckCircle2,
} from "lucide-react";
import {
  decodeAudioData,
  audioBufferToWav,
  audioBufferToMp3,
  formatTime,
  formatBytes,
} from "@/lib/audio-utils";

type TargetFormat = "mp3" | "wav";

export function AudioConverterWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("mp3");
  const [mp3Bitrate, setMp3Bitrate] = useState<number>(192);

  const [isDecoding, setIsDecoding] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const uploaded = acceptedFiles[0];
    setFile(uploaded);
    setErrorMsg("");
    setConvertedUrl(null);
    setConvertedSize(null);
    setIsDecoding(true);

    try {
      const { buffer, audioCtx } = await decodeAudioData(uploaded);
      setAudioBuffer(buffer);
      audioCtx.close();

      // If user uploaded mp3, default target format to wav; else default to mp3
      if (uploaded.name.toLowerCase().endsWith(".mp3")) {
        setTargetFormat("wav");
      } else {
        setTargetFormat("mp3");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to decode audio file. Please check that the file is not corrupted.");
    } finally {
      setIsDecoding(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav", ".ogg", ".aac", ".m4a", ".flac", ".webm"] },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!audioBuffer) return;
    setIsConverting(true);
    setErrorMsg("");

    try {
      let outputBlob: Blob;
      if (targetFormat === "wav") {
        outputBlob = audioBufferToWav(audioBuffer);
      } else {
        outputBlob = audioBufferToMp3(audioBuffer, mp3Bitrate);
      }

      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      const url = URL.createObjectURL(outputBlob);
      setConvertedUrl(url);
      setConvertedSize(outputBlob.size);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setAudioBuffer(null);
    setErrorMsg("");
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedUrl(null);
    setConvertedSize(null);
  };

  const originalExtension = file ? file.name.split(".").pop()?.toUpperCase() : "";

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
              <Repeat className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Choose an audio file to convert
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Convert between MP3, WAV, OGG, AAC, FLAC, M4A, and WebM
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--paper)] border border-[var(--border)] text-[var(--ink-muted)]">
              Client-Side LAME MP3 & 16-Bit PCM WAV Encoding
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
                  {formatBytes(file.size)} • {originalExtension} • {audioBuffer ? formatTime(audioBuffer.duration) : "..."}
                </p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Convert Another
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
              <p className="mt-3 text-sm text-[var(--ink-muted)]">Analyzing audio streams...</p>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              {/* Target Format Options */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[var(--ink)]">Target Output Settings</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Format Card */}
                  <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-3">
                    <label className="text-xs font-semibold text-[var(--ink)] block">
                      Target Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTargetFormat("mp3")}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          targetFormat === "mp3"
                            ? "border-[var(--primary)] bg-[var(--surface)] shadow-sm"
                            : "border-[var(--border)] hover:border-[var(--ink)] bg-transparent"
                        }`}
                      >
                        <div className="font-bold text-sm text-[var(--ink)]">MP3</div>
                        <div className="text-xs text-[var(--ink-muted)] mt-0.5">Universal & compact</div>
                      </button>

                      <button
                        onClick={() => setTargetFormat("wav")}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          targetFormat === "wav"
                            ? "border-[var(--primary)] bg-[var(--surface)] shadow-sm"
                            : "border-[var(--border)] hover:border-[var(--ink)] bg-transparent"
                        }`}
                      >
                        <div className="font-bold text-sm text-[var(--ink)]">WAV</div>
                        <div className="text-xs text-[var(--ink-muted)] mt-0.5">Lossless studio PCM</div>
                      </button>
                    </div>
                  </div>

                  {/* Quality Settings */}
                  <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-3">
                    <label className="text-xs font-semibold text-[var(--ink)] block">
                      {targetFormat === "mp3" ? "Audio Bitrate" : "Audio Bit Depth"}
                    </label>
                    {targetFormat === "mp3" ? (
                      <div className="space-y-2">
                        <select
                          value={mp3Bitrate}
                          onChange={(e) => setMp3Bitrate(Number(e.target.value))}
                          className="w-full text-sm p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)] font-medium"
                        >
                          <option value={320}>320 kbps (Maximum Quality)</option>
                          <option value={256}>256 kbps (High Fidelity)</option>
                          <option value={192}>192 kbps (Standard Music)</option>
                          <option value={128}>128 kbps (Balanced)</option>
                          <option value={96}>96 kbps (Voice / Audiobook)</option>
                          <option value={64}>64 kbps (Smallest Size)</option>
                        </select>
                        <p className="text-xs text-[var(--ink-muted)]">
                          Higher bitrate provides richer audio spectrum with slightly larger file size.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)] font-medium">
                          16-bit Stereo PCM (Uncompressed)
                        </div>
                        <p className="text-xs text-[var(--ink-muted)]">
                          Industry standard RIFF WAVE structure compatible with DAWs and all media players.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversion Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                <div className="text-xs text-[var(--ink-muted)]">
                  Converting from <strong>{originalExtension}</strong> to <strong>{targetFormat.toUpperCase()}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 text-sm"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Encoding {targetFormat.toUpperCase()}...
                      </>
                    ) : (
                      <>
                        <Repeat className="w-4 h-4" />
                        Convert to {targetFormat.toUpperCase()}
                      </>
                    )}
                  </button>

                  {convertedUrl && (
                    <a
                      href={convertedUrl}
                      download={`${file.name.replace(/\.[^/.]+$/, "")}_converted.${targetFormat}`}
                      className="px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download ({formatBytes(convertedSize || 0)})
                    </a>
                  )}
                </div>
              </div>

              {/* In-Browser Verification Player */}
              {convertedUrl && (
                <div className="p-5 rounded-xl bg-[var(--paper)] border border-emerald-500/30 dark:border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Conversion Successful & Ready
                    </div>
                    <span className="text-xs font-mono text-[var(--ink-muted)]">
                      Output Size: {formatBytes(convertedSize || 0)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[var(--ink-muted)] flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" /> Listen to output file:
                    </label>
                    <audio controls src={convertedUrl} className="w-full h-10 rounded" />
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
