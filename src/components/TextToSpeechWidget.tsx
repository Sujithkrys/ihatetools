"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  Sparkles,
  Info,
  Sliders,
  RotateCcw,
} from "lucide-react";

const SAMPLE_TEXTS = [
  {
    title: "Product Overview",
    text: "Welcome to ihatetools. All our tools operate one hundred percent client-side in your web browser. No files are ever sent to remote servers, giving you complete privacy and instant speed.",
  },
  {
    title: "Technology Quote",
    text: "Simplicity is prerequisite for reliability. The best tools are those that do one specific job with elegance, zero bloat, and total transparency.",
  },
  {
    title: "Short Story",
    text: "Early morning sunlight washed over the quiet harbor. A gentle breeze stirred the sails as the old lighthouse keeper stepped onto the balcony, looking out across the calm ocean.",
  },
];

export function TextToSpeechWidget() {
  const [text, setText] = useState(SAMPLE_TEXTS[0].text);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [charIndex, setCharIndex] = useState<number | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available system voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        // Default to first English voice or first voice
        const defaultVoice =
          available.find((v) => v.lang.startsWith("en") && v.default) ||
          available.find((v) => v.lang.startsWith("en")) ||
          available[0];
        if (defaultVoice) {
          setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!text.trim()) return;

    // If currently paused, resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const chosenVoice = voices.find((v) => v.voiceURI === selectedVoiceURI);
    if (chosenVoice) utterance.voice = chosenVoice;

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCharIndex(0);
    };

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        setCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCharIndex(null);
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsSpeaking(false);
      setIsPaused(false);
      setCharIndex(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCharIndex(null);
  };

  const resetSliders = () => {
    setRate(1);
    setPitch(1);
    setVolume(1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Text Card */}
      <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-sm text-[var(--ink)]">Text to Synthesize</h3>
          </div>

          {/* Quick Demo Texts */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--ink-muted)] mr-1">Sample:</span>
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.title}
                onClick={() => {
                  handleStop();
                  setText(sample.text);
                }}
                className="px-2.5 py-1 text-xs rounded-md border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            rows={5}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (isSpeaking) handleStop();
            }}
            placeholder="Type or paste any text here to hear it read aloud..."
            className="w-full text-base p-4 bg-[var(--paper)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--primary)] text-[var(--ink)] leading-relaxed resize-y"
          />
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] pt-1 px-1">
            <span>
              {text.trim().split(/\s+/).filter(Boolean).length} words • {text.length} characters
            </span>
            {isSpeaking && charIndex !== null && (
              <span className="text-[var(--primary)] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Speaking in real-time...
              </span>
            )}
          </div>
        </div>

        {/* Speech Controls & Sliders */}
        <div className="p-5 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h4 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Voice & Pitch Parameters
            </h4>
            <button
              onClick={resetSliders}
              className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voice Picker */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[var(--ink)] block mb-1.5">
                Installed System Voice ({voices.length} detected)
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => {
                  setSelectedVoiceURI(e.target.value);
                  if (isSpeaking) handleStop();
                }}
                className="w-full text-sm p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--ink)] font-medium"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang}) {v.default ? "— Default" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Speed (Rate) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[var(--ink)] font-semibold">
                <span>Speed / Rate</span>
                <span>{rate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-[11px] text-[var(--ink-muted)]">
                <span>0.5x (Slow)</span>
                <span>1.0x</span>
                <span>2.0x (Fast)</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[var(--ink)] font-semibold">
                <span>Pitch</span>
                <span>{pitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-[11px] text-[var(--ink-muted)]">
                <span>0.5x (Deep)</span>
                <span>1.0x (Normal)</span>
                <span>1.5x (High)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            {!isSpeaking || isPaused ? (
              <button
                onClick={handleSpeak}
                disabled={!text.trim()}
                className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 text-sm shadow-sm"
              >
                <Play className="w-4 h-4" /> {isPaused ? "Resume Speech" : "Speak Aloud"}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-6 py-2.5 bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] font-semibold rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-2 text-sm shadow-sm"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={!isSpeaking && !isPaused}
              className="px-4 py-2.5 bg-[var(--surface)] text-[var(--ink-muted)] hover:text-red-500 border border-[var(--border)] font-medium rounded-lg hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-30 inline-flex items-center gap-1.5 text-sm"
            >
              <Square className="w-3.5 h-3.5" /> Stop
            </button>
          </div>
        </div>

        {/* Technical Notice on Native SpeechSynthesis & Download */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex items-start gap-3 text-xs text-[var(--ink-muted)] leading-relaxed">
          <Info className="w-4 h-4 shrink-0 text-[var(--primary)] mt-0.5" />
          <div>
            <strong className="text-[var(--ink)]">On-Device Privacy & Download Notice:</strong> The browser&apos;s native SpeechSynthesis API renders voice audio directly through your device&apos;s operating system hardware. Modern browser security sandboxes prevent websites from intercepting OS synthesis streams into raw downloadable audio files without external microphone permissions. High-fidelity playback occurs completely on-device with zero data leaving your machine.
          </div>
        </div>
      </div>
    </div>
  );
}
