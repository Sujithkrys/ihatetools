import { Metadata } from "next";
import { Minimize2 } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { AudioCompressorWidget } from "@/components/AudioCompressorWidget";

export const metadata: Metadata = {
  title: "Audio Compressor - Reduce Audio File Size Online | ihatetools",
  description: "Compress audio files with honest before & after file size verification. Downsample bitrates and convert stereo to mono for podcasts and voice.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Audio File",
    description: "Drop your large audio file (WAV, high-bitrate MP3, FLAC, etc.).",
  },
  {
    title: "Choose Compression Profile",
    description: "Pick standard music (128 kbps), speech/podcast (64 kbps mono), or maximum compression (32 kbps).",
  },
  {
    title: "Audit Real Savings",
    description: "Review genuine byte-for-byte reduction metrics, test the sound in the preview player, and download.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does audio compression work?",
    answer: "Audio files are compressed by reducing the bitrate (the amount of data encoded per second) and optionally downmixing dual stereo channels into a single mono channel.",
  },
  {
    question: "Why did my file size not decrease significantly?",
    answer: "If your source file is already an aggressively compressed low-bitrate MP3, re-compressing it cannot shrink the file further without corrupting the audio. ihatetools adheres to an honest disclosure standard and tells you if compression is not beneficial.",
  },
  {
    question: "Which setting is best for podcasts and voice recordings?",
    answer: "The 'Voice / Podcast' preset (64 kbps mono) reduces voice recordings by up to 75% while keeping vocal clarity perfectly crisp.",
  },
];

const RELATED_TOOLS = [
  { name: "Audio Format Converter", href: "/tools/audio-converter" },
  { name: "Audio Trimmer", href: "/tools/audio-trimmer" },
  { name: "Merge Audio Files", href: "/tools/merge-audio" },
];

export default function AudioCompressorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Minimize2 className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Audio Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Audio Compressor
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Reduce audio file sizes with honest before & after metrics and immediate quality auditioning.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / audio / compressor">
        <AudioCompressorWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
