"use client";

import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Download,
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import {
  decodeAudioData,
  mergeAudioBuffers,
  audioBufferToMp3,
  audioBufferToWav,
  formatTime,
  formatBytes,
} from "@/lib/audio-utils";

interface AudioTrackItem {
  id: string;
  file: File;
  buffer: AudioBuffer;
  duration: number;
}

export function MergeAudioWidget() {
  const [tracks, setTracks] = useState<AudioTrackItem[]>([]);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [exportFormat, setExportFormat] = useState<"mp3" | "wav">("mp3");
  const [mp3Bitrate, setMp3Bitrate] = useState<number>(192);

  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number | null>(null);
  const [mergedDuration, setMergedDuration] = useState<number | null>(null);

  // Individual track preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        // @ts-expect-error webkitAudioContext fallback
        window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopPreview = () => {
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch {}
      activeSourceRef.current = null;
    }
    setPlayingTrackId(null);
  };

  const toggleTrackPreview = (track: AudioTrackItem) => {
    if (playingTrackId === track.id) {
      stopPreview();
      return;
    }

    stopPreview();
    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = track.buffer;
    source.connect(ctx.destination);
    source.start(0);

    source.onended = () => {
      setPlayingTrackId(null);
    };

    activeSourceRef.current = source;
    setPlayingTrackId(track.id);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    setIsDecoding(true);
    setErrorMsg("");
    setMergedUrl(null);

    const newTracks: AudioTrackItem[] = [];

    for (const f of acceptedFiles) {
      try {
        const { buffer } = await decodeAudioData(f);
        newTracks.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          buffer,
          duration: buffer.duration,
        });
      } catch (err) {
        console.error("Failed to decode track:", f.name, err);
        setErrorMsg(`Failed to decode "${f.name}". Please ensure it is a valid audio file.`);
      }
    }

    setTracks((prev) => [...prev, ...newTracks]);
    setIsDecoding(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav", ".ogg", ".aac", ".m4a", ".flac", ".webm"] },
    multiple: true,
  });

  const moveTrack = (index: number, direction: "up" | "down") => {
    setTracks((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const removeTrack = (id: string) => {
    if (playingTrackId === id) stopPreview();
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const totalInputDuration = tracks.reduce((sum, t) => sum + t.duration, 0);

  const handleMerge = async () => {
    if (tracks.length < 2) {
      setErrorMsg("Please add at least 2 audio files to merge.");
      return;
    }
    stopPreview();
    setIsMerging(true);
    setErrorMsg("");

    try {
      const ctx = getAudioContext();
      const buffers = tracks.map((t) => t.buffer);
      const mergedBuffer = mergeAudioBuffers(ctx, buffers);

      let blob: Blob;
      if (exportFormat === "wav") {
        blob = audioBufferToWav(mergedBuffer);
      } else {
        blob = audioBufferToMp3(mergedBuffer, mp3Bitrate);
      }

      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
      setMergedSize(blob.size);
      setMergedDuration(mergedBuffer.duration);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to merge audio tracks.");
    } finally {
      setIsMerging(false);
    }
  };

  const clearAll = () => {
    stopPreview();
    setTracks([]);
    setErrorMsg("");
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setMergedUrl(null);
    setMergedSize(null);
    setMergedDuration(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {tracks.length === 0 ? (
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
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Select audio files to combine
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Upload multiple audio tracks, arrange them in order, and merge seamlessly
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--paper)] border border-[var(--border)] text-[var(--ink-muted)]">
              MP3, WAV, AAC, M4A, OGG, WebM, FLAC
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center space-x-3">
              <Layers className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <p className="font-semibold text-[var(--ink)]">
                  {tracks.length} Audio Clip{tracks.length === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  Total Duration: <strong>{formatTime(totalInputDuration)}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div {...getRootProps()} className="inline-block">
                <input {...getInputProps()} />
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add More Clips
                </button>
              </div>

              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-red-500 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isDecoding && (
            <div className="p-6 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)] flex items-center justify-center gap-3 text-xs text-[var(--ink-muted)]">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
              Decoding uploaded audio clips...
            </div>
          )}

          {/* Track List with Reorder Controls */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] pb-2 border-b border-[var(--border)]">
              <span>Sequence Order (Clips will be concatenated from top to bottom)</span>
              <span>{tracks.length} items</span>
            </div>

            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--paper)] hover:border-[var(--ink)]/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-6 h-6 rounded-full bg-[var(--surface)] text-[var(--ink)] text-xs font-bold flex items-center justify-center shrink-0 border border-[var(--border)]">
                      {index + 1}
                    </span>

                    <button
                      onClick={() => toggleTrackPreview(track)}
                      className="w-8 h-8 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                      title={playingTrackId === track.id ? "Pause" : "Play preview"}
                    >
                      {playingTrackId === track.id ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>

                    <div className="truncate">
                      <p className="text-sm font-semibold text-[var(--ink)] truncate">
                        {track.file.name}
                      </p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {formatTime(track.duration)} • {formatBytes(track.file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveTrack(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:opacity-20 transition-colors rounded hover:bg-[var(--surface)]"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => moveTrack(index, "down")}
                      disabled={index === tracks.length - 1}
                      className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:opacity-20 transition-colors rounded hover:bg-[var(--surface)]"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeTrack(track.id)}
                      className="p-1.5 text-[var(--ink-muted)] hover:text-red-500 transition-colors rounded hover:bg-[var(--surface)] ml-1"
                      title="Remove clip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge Settings & Action */}
            <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--border)] space-y-4 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[var(--ink)]">Format:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExportFormat("mp3")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        exportFormat === "mp3"
                          ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                          : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      MP3
                    </button>
                    <button
                      onClick={() => setExportFormat("wav")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        exportFormat === "wav"
                          ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                          : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      WAV (PCM)
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
                      <option value={320}>320 kbps</option>
                      <option value={192}>192 kbps</option>
                      <option value={128}>128 kbps</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--border)]">
                <div className="text-xs text-[var(--ink-muted)]">
                  Merged file length will be: <strong>{formatTime(totalInputDuration)}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMerge}
                    disabled={isMerging || tracks.length < 2}
                    className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 text-sm shadow-sm"
                  >
                    {isMerging ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Concatenating Clips...
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4" />
                        Merge {tracks.length} Clips
                      </>
                    )}
                  </button>

                  {mergedUrl && (
                    <a
                      href={mergedUrl}
                      download={`merged_audio.${exportFormat}`}
                      className="px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download ({formatBytes(mergedSize || 0)})
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Output Audition Player */}
            {mergedUrl && (
              <div className="p-5 rounded-xl bg-[var(--paper)] border border-emerald-500/30 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Concatenation Complete
                  </div>
                  <span className="text-xs font-mono text-[var(--ink-muted)]">
                    Total Duration: {formatTime(mergedDuration || 0)} • Size: {formatBytes(mergedSize || 0)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[var(--ink-muted)] flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" /> Listen to merged file:
                  </label>
                  <audio controls src={mergedUrl} className="w-full h-10 rounded" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
