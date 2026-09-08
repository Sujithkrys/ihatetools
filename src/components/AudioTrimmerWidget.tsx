"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Download,
  Loader2,
  RefreshCw,
  Play,
  Pause,
  Scissors,
  Music,
  AlertCircle,
  Volume2,
} from "lucide-react";
import {
  decodeAudioData,
  audioBufferToWav,
  audioBufferToMp3,
  drawWaveform,
  formatTime,
  formatBytes,
} from "@/lib/audio-utils";

export function AudioTrimmerWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [exportFormat, setExportFormat] = useState<"wav" | "mp3">("mp3");
  const [mp3Bitrate, setMp3Bitrate] = useState(192);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number>(0);
  const playbackOffsetRef = useRef<number>(0);

  // Load Audio
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const uploaded = acceptedFiles[0];
    setFile(uploaded);
    setErrorMsg("");
    setDownloadUrl(null);
    setOutputSize(null);
    setIsProcessing(true);
    stopPlayback();

    try {
      const { buffer, audioCtx: ctx } = await decodeAudioData(uploaded);
      setAudioBuffer(buffer);
      setAudioCtx(ctx);
      setDuration(buffer.duration);
      setStartTime(0);
      setEndTime(buffer.duration);
      setPlaybackTime(0);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to decode audio file. Make sure it is a valid MP3, WAV, AAC, or OGG file.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav", ".ogg", ".aac", ".m4a", ".flac", ".webm"] },
    multiple: false,
  });

  // Stop playback helper
  const stopPlayback = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch {}
      currentSourceRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPlaying(false);
  };

  // Playback trimmed range
  const togglePlay = () => {
    if (!audioBuffer || !audioCtx) return;

    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const playStart = playbackTime >= endTime || playbackTime < startTime ? startTime : playbackTime;
    const playDur = Math.max(0.1, endTime - playStart);

    source.start(0, playStart, playDur);
    currentSourceRef.current = source;
    playStartTimeRef.current = audioCtx.currentTime;
    playbackOffsetRef.current = playStart;
    setIsPlaying(true);

    const updatePlayhead = () => {
      if (!audioCtx) return;
      const elapsed = audioCtx.currentTime - playStartTimeRef.current;
      const currentPos = playbackOffsetRef.current + elapsed;

      if (currentPos >= endTime) {
        setPlaybackTime(startTime);
        setIsPlaying(false);
        if (currentSourceRef.current) {
          try { currentSourceRef.current.stop(); } catch {}
          currentSourceRef.current = null;
        }
      } else {
        setPlaybackTime(currentPos);
        animationFrameRef.current = requestAnimationFrame(updatePlayhead);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updatePlayhead);

    source.onended = () => {
      setIsPlaying(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  };

  // Redraw waveform on parameter changes
  useEffect(() => {
    if (!canvasRef.current || !audioBuffer || duration <= 0) return;
    const startPct = startTime / duration;
    const endPct = endTime / duration;
    const curPct = playbackTime / duration;
    drawWaveform(canvasRef.current, audioBuffer, startPct, endPct, curPct);
  }, [audioBuffer, startTime, endTime, playbackTime, duration]);

  // Handle canvas click to scrub/set positions
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || duration <= 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const targetTime = pct * duration;

    // If closer to start, adjust start; if closer to end, adjust end; else scrub
    const distToStart = Math.abs(targetTime - startTime);
    const distToEnd = Math.abs(targetTime - endTime);

    if (distToStart < 0.5) {
      setStartTime(targetTime);
    } else if (distToEnd < 0.5) {
      setEndTime(targetTime);
    } else {
      setPlaybackTime(targetTime);
      if (isPlaying) {
        stopPlayback();
      }
    }
  };

  // Export trimmed audio
  const handleExport = async () => {
    if (!audioBuffer) return;
    setIsExporting(true);
    setErrorMsg("");

    try {
      let blob: Blob;
      if (exportFormat === "wav") {
        blob = audioBufferToWav(audioBuffer, startTime, endTime);
      } else {
        blob = audioBufferToMp3(audioBuffer, mp3Bitrate, startTime, endTime);
      }

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputSize(blob.size);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to export trimmed audio.");
    } finally {
      setIsExporting(false);
    }
  };

  const resetAll = () => {
    stopPlayback();
    setFile(null);
    setAudioBuffer(null);
    if (audioCtx) {
      audioCtx.close();
      setAudioCtx(null);
    }
    setStartTime(0);
    setEndTime(0);
    setDuration(0);
    setPlaybackTime(0);
    setErrorMsg("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setOutputSize(null);
  };

  const trimmedDuration = Math.max(0, endTime - startTime);

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
              <Scissors className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Choose an audio file to trim
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Drag & drop MP3, WAV, AAC, M4A, OGG, or FLAC here
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--paper)] border border-[var(--border)] text-[var(--ink-muted)]">
              100% Client-Side Web Audio Processing
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center space-x-3 truncate">
              <Music className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-[var(--ink)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {formatBytes(file.size)} • Total length: {formatTime(duration)}
                </p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose Another
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isProcessing ? (
            <div className="p-12 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
              <p className="mt-3 text-sm text-[var(--ink-muted)]">Decoding audio waveform...</p>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              {/* Waveform Canvas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                  <span>Waveform Timeline</span>
                  <span>
                    Playhead: <strong className="text-[var(--ink)]">{formatTime(playbackTime)}</strong>
                  </span>
                </div>

                <div className="relative border border-[var(--border)] rounded-lg bg-[var(--paper)] p-2">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={130}
                    onClick={handleCanvasClick}
                    className="w-full h-32 rounded cursor-pointer block"
                  />
                </div>
              </div>

              {/* Playback Controls & Range Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-t border-[var(--border)] pt-4">
                {/* Start Time */}
                <div>
                  <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1">
                    Start Position (sec)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={endTime}
                      value={Number(startTime.toFixed(2))}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(Number(e.target.value), endTime - 0.1));
                        setStartTime(val);
                        setPlaybackTime(val);
                      }}
                      className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded font-mono text-[var(--ink)]"
                    />
                    <span className="text-xs font-mono text-[var(--ink-muted)]">
                      {formatTime(startTime)}
                    </span>
                  </div>
                </div>

                {/* Play / Pause Button */}
                <div className="flex flex-col items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center shadow hover:opacity-90 transition-opacity"
                    title={isPlaying ? "Pause range" : "Play selected range"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <span className="text-xs text-[var(--ink-muted)] mt-1.5 font-medium">
                    Trimmed Length: {formatTime(trimmedDuration)}
                  </span>
                </div>

                {/* End Time */}
                <div>
                  <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1">
                    End Position (sec)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min={startTime + 0.1}
                      max={duration}
                      value={Number(endTime.toFixed(2))}
                      onChange={(e) => {
                        const val = Math.max(startTime + 0.1, Math.min(Number(e.target.value), duration));
                        setEndTime(val);
                      }}
                      className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded font-mono text-[var(--ink)]"
                    />
                    <span className="text-xs font-mono text-[var(--ink-muted)]">
                      {formatTime(endTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Export Settings */}
              <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--border)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[var(--ink)]">Export Format:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExportFormat("mp3")}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          exportFormat === "mp3"
                            ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                            : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                        }`}
                      >
                        MP3 (Compressed)
                      </button>
                      <button
                        onClick={() => setExportFormat("wav")}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          exportFormat === "wav"
                            ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                            : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                        }`}
                      >
                        WAV (Lossless PCM)
                      </button>
                    </div>
                  </div>

                  {exportFormat === "mp3" && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--ink-muted)]">Bitrate:</span>
                      <select
                        value={mp3Bitrate}
                        onChange={(e) => setMp3Bitrate(Number(e.target.value))}
                        className="text-xs p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink)]"
                      >
                        <option value={320}>320 kbps (Studio)</option>
                        <option value={192}>192 kbps (High Quality)</option>
                        <option value={128}>128 kbps (Standard)</option>
                        <option value={96}>96 kbps (Voice/Compact)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--border)]">
                  <div className="text-xs text-[var(--ink-muted)]">
                    Selected cut: {formatTime(startTime)} → {formatTime(endTime)} ({formatTime(trimmedDuration)})
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExport}
                      disabled={isExporting || trimmedDuration <= 0}
                      className="px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
                      Export Clip
                    </button>

                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download={`trimmed_${file.name.replace(/\.[^/.]+$/, "")}.${exportFormat}`}
                        className="px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Download ({formatBytes(outputSize || 0)})
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* In-browser audio player for trimmed export */}
              {downloadUrl && (
                <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                    Preview Exported Audio:
                  </div>
                  <audio controls src={downloadUrl} className="w-full h-10" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
