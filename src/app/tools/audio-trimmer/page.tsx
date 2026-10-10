import { Metadata } from "next";
import { Scissors } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { AudioTrimmerWidget } from "@/components/AudioTrimmerWidget";

export const metadata: Metadata = {
  title: "Audio Trimmer - Cut & Trim Audio Files Online | ihatetools",
  description: "Trim and cut MP3, WAV, AAC, and audio tracks online with interactive waveforms. 100% private client-side audio cutting.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Audio Clip",
    description: "Drop your audio file into the tool. The interactive waveform renders instantly in your browser.",
  },
  {
    title: "Select Start & End Range",
    description: "Drag the range markers or enter precise timestamps to isolate your desired audio segment.",
  },
  {
    title: "Audition & Export",
    description: "Play your trimmed section to preview accuracy, then download as high-quality MP3 or lossless WAV.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What audio file formats can I trim?",
    answer: "You can upload and trim MP3, WAV, AAC, M4A, OGG, WebM, and FLAC audio files.",
  },
  {
    question: "Is my audio uploaded to a remote server?",
    answer: "No. The entire trimming, waveform generation, and encoding pipeline runs locally in your web browser via the Web Audio API and LAME MP3 encoding.",
  },
  {
    question: "Does trimming degrade audio quality?",
    answer: "If you export as WAV, it is completely lossless PCM. If you export as MP3, you can select high bitrates up to 320 kbps for pristine sound.",
  },
];

const RELATED_TOOLS = [
  { name: "Audio Format Converter", href: "/tools/audio-converter" },
  { name: "Audio Compressor", href: "/tools/audio-compressor" },
  { name: "Merge Audio Files", href: "/tools/merge-audio" },
];

export default function AudioTrimmerPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Scissors className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Audio Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Audio Trimmer
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Cut and edit audio files with visual waveform precision directly in your browser.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / audio / trimmer">
        <AudioTrimmerWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
