"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock,
  Copy,
  Check,
  Calendar,
  RefreshCw,
  Globe,
  Pause,
  Play,
} from "lucide-react";

export function TimestampConverterWidget() {
  // Current live clock
  const [currentSec, setCurrentSec] = useState<number>(Math.floor(Date.now() / 1000));
  const [isClockPaused, setIsClockPaused] = useState(false);

  // Timestamp -> Date states
  const [tsInput, setTsInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [tsUnit, setTsUnit] = useState<"seconds" | "milliseconds">("seconds");

  // Date -> Timestamp states
  const [dateInput, setDateInput] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [timezoneMode, setTimezoneMode] = useState<"local" | "utc">("local");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live timer tick
  useEffect(() => {
    if (isClockPaused) return;
    const interval = setInterval(() => {
      setCurrentSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockPaused]);

  // Relative time helper
  const getRelativeTime = (timestampMs: number) => {
    const diffSec = Math.round((timestampMs - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(diffSec) < 60) {
      return rtf.format(diffSec, "second");
    }
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) {
      return rtf.format(diffMin, "minute");
    }
    const diffHours = Math.round(diffMin / 60);
    if (Math.abs(diffHours) < 24) {
      return rtf.format(diffHours, "hour");
    }
    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 30) {
      return rtf.format(diffDays, "day");
    }
    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) {
      return rtf.format(diffMonths, "month");
    }
    return rtf.format(Math.round(diffDays / 365), "year");
  };

  // Convert Timestamp -> Date
  const parsedDate = useMemo(() => {
    const trimmed = tsInput.trim();
    if (!trimmed || isNaN(Number(trimmed))) {
      return null;
    }
    const num = Number(trimmed);
    const ms = tsUnit === "seconds" ? num * 1000 : num;
    const date = new Date(ms);

    if (isNaN(date.getTime())) return null;

    return {
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "long",
      }),
      localShort: date.toLocaleString(),
      relative: getRelativeTime(ms),
      seconds: Math.floor(ms / 1000),
      milliseconds: ms,
    };
  }, [tsInput, tsUnit]);

  // Convert Date -> Timestamp
  const computedTimestampFromDate = useMemo(() => {
    if (!dateInput) return null;
    let date: Date;

    if (timezoneMode === "utc") {
      date = new Date(dateInput + "Z");
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return null;

    const ms = date.getTime();
    const sec = Math.floor(ms / 1000);

    return {
      sec,
      ms,
      iso: date.toISOString(),
      utc: date.toUTCString(),
    };
  }, [dateInput, timezoneMode]);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetNow = useCallback(() => {
    const nowSec = Math.floor(Date.now() / 1000);
    setTsInput(tsUnit === "seconds" ? nowSec.toString() : (nowSec * 1000).toString());
  }, [tsUnit]);

  const handleSetPreset = (preset: "todayStart" | "todayEnd" | "yesterday" | "tomorrow") => {
    const now = new Date();
    if (preset === "todayStart") {
      now.setHours(0, 0, 0, 0);
    } else if (preset === "todayEnd") {
      now.setHours(23, 59, 59, 999);
    } else if (preset === "yesterday") {
      now.setDate(now.getDate() - 1);
    } else if (preset === "tomorrow") {
      now.setDate(now.getDate() + 1);
    }
    const ms = now.getTime();
    setTsInput(tsUnit === "seconds" ? Math.floor(ms / 1000).toString() : ms.toString());
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Current Unix Timestamp Live Banner */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Current Unix Timestamp
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[var(--foreground)] mt-0.5">
              {currentSec}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(currentSec.toString(), "live-sec")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            {copiedKey === "live-sec" ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>Copy Seconds</span>
          </button>
          <button
            onClick={() => handleCopy((currentSec * 1000).toString(), "live-ms")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--border)] transition-colors text-[var(--foreground)]"
          >
            {copiedKey === "live-ms" ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy MS</span>
          </button>
          <button
            onClick={() => setIsClockPaused((prev) => !prev)}
            title={isClockPaused ? "Resume Live Clock" : "Pause Live Clock"}
            className="p-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--border)] transition-colors text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            {isClockPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Section 1: Timestamp to Date */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-[var(--foreground)]">Convert Unix Timestamp to Human Date</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSetNow}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-[var(--border)] hover:bg-[var(--border)] transition-colors text-[var(--foreground)]"
            >
              <RefreshCw className="w-3 h-3 text-emerald-500" />
              Set to Now
            </button>
          </div>
        </div>

        {/* Input row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
              Enter Timestamp
            </label>
            <input
              type="text"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              placeholder="e.g. 1725792000"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
              Input Unit
            </label>
            <div className="flex rounded-lg border border-[var(--border)] bg-[var(--background)] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTsUnit("seconds")}
                className={`flex-1 py-1 rounded transition-colors ${
                  tsUnit === "seconds"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)]"
                }`}
              >
                Seconds (s)
              </button>
              <button
                type="button"
                onClick={() => setTsUnit("milliseconds")}
                className={`flex-1 py-1 rounded transition-colors ${
                  tsUnit === "milliseconds"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)]"
                }`}
              >
                Millis (ms)
              </button>
            </div>
          </div>
        </div>

        {/* Preset quick links */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">Quick Presets:</span>
          <button
            onClick={() => handleSetPreset("todayStart")}
            className="px-2 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--border)] text-[var(--foreground)]"
          >
            Start of today
          </button>
          <button
            onClick={() => handleSetPreset("todayEnd")}
            className="px-2 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--border)] text-[var(--foreground)]"
          >
            End of today
          </button>
          <button
            onClick={() => handleSetPreset("yesterday")}
            className="px-2 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--border)] text-[var(--foreground)]"
          >
            Yesterday
          </button>
          <button
            onClick={() => handleSetPreset("tomorrow")}
            className="px-2 py-0.5 rounded border border-[var(--border)] hover:bg-[var(--border)] text-[var(--foreground)]"
          >
            Tomorrow
          </button>
        </div>

        {/* Results display */}
        {parsedDate ? (
          <div className="space-y-2 pt-2">
            <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-[var(--muted)]">ISO 8601 (UTC)</div>
                <div className="font-mono text-xs sm:text-sm text-[var(--foreground)] mt-0.5 break-all">
                  {parsedDate.iso}
                </div>
              </div>
              <button
                onClick={() => handleCopy(parsedDate.iso, "iso")}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                title="Copy ISO string"
              >
                {copiedKey === "iso" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-[var(--muted)]">RFC 2822 / UTC Format</div>
                <div className="font-mono text-xs sm:text-sm text-[var(--foreground)] mt-0.5 break-all">
                  {parsedDate.utc}
                </div>
              </div>
              <button
                onClick={() => handleCopy(parsedDate.utc, "utc")}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                title="Copy UTC string"
              >
                {copiedKey === "utc" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Local Timezone</div>
                <div className="font-mono text-xs sm:text-sm text-[var(--foreground)] mt-0.5 break-all">
                  {parsedDate.local}
                </div>
              </div>
              <button
                onClick={() => handleCopy(parsedDate.local, "local")}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                title="Copy Local string"
              >
                {copiedKey === "local" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Relative Time</div>
                <div className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {parsedDate.relative}
                </div>
              </div>
              <button
                onClick={() => handleCopy(parsedDate.relative, "relative")}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                title="Copy relative time"
              >
                {copiedKey === "relative" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-400/30 text-xs text-amber-600 dark:text-amber-400">
            Please enter a valid numeric Unix timestamp.
          </div>
        )}
      </div>

      {/* Section 2: Date to Timestamp */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-[var(--foreground)]">Convert Human Date to Unix Timestamp</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-[var(--border)] bg-[var(--background)] p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimezoneMode("local")}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timezoneMode === "local"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)]"
                }`}
              >
                Local TZ
              </button>
              <button
                type="button"
                onClick={() => setTimezoneMode("utc")}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timezoneMode === "utc"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)]"
                }`}
              >
                UTC
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] mb-1">
              Select Date & Time ({timezoneMode === "utc" ? "UTC" : "Local"})
            </label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--foreground)]"
            />
          </div>

          {computedTimestampFromDate && (
            <div className="space-y-2">
              <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Unix Seconds (Epoch)</div>
                  <div className="font-mono text-sm font-bold text-[var(--accent)] mt-0.5">
                    {computedTimestampFromDate.sec}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(computedTimestampFromDate.sec.toString(), "conv-sec")}
                  className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {copiedKey === "conv-sec" ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[var(--muted)]">Unix Milliseconds</div>
                  <div className="font-mono text-sm font-bold text-[var(--foreground)] mt-0.5">
                    {computedTimestampFromDate.ms}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(computedTimestampFromDate.ms.toString(), "conv-ms")}
                  className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {copiedKey === "conv-ms" ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
