import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { AudioConverterWidget } from "@/components/AudioConverterWidget";

export const metadata: Metadata = {
  title: "Audio Format Converter - Convert WAV to MP3 Online | ihatetools",
  description: "Convert audio files between MP3, WAV, AAC, and OGG formats client-side. Fast, private, with in-browser audio player verification.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Audio File",
    description: "Choose any standard audio file from your computer or phone.",
  },
  {
    title: "Select Output Format",
    description: "Pick MP3 (with custom bitrates up to 320 kbps) or lossless 16-bit PCM WAV.",
  },
  {
    title: "Convert & Listen",
    description: "Your file is converted in-memory. Play it back instantly in the player to verify fidelity before downloading.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does the in-browser conversion work?",
    answer: "Your browser decodes the source audio via Web Audio API into PCM float samples, which are then encoded into standard MP3 frames or RIFF WAV chunks entirely in JavaScript.",
  },
  {
    question: "Can I convert WAV to MP3 without quality loss?",
    answer: "Selecting 320 kbps or 192 kbps MP3 produces near-indistinguishable quality from original studio recordings with significant size reductions.",
  },
  {
    question: "Is there any file upload limit?",
    answer: "Because files are processed purely client-side in RAM, you can convert as many files as your device memory allows with zero upload delays.",
  },
];

const RELATED_TOOLS = [
  { name: "Audio Trimmer", href: "/tools/audio-trimmer" },
  { name: "Audio Compressor", href: "/tools/audio-compressor" },
  { name: "Merge Audio Files", href: "/tools/merge-audio" },
];

export default function AudioConverterPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Audio Format Converter
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
          Transcode audio files between MP3 and WAV with verified audio player playback.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / audio / converter">
        <AudioConverterWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
