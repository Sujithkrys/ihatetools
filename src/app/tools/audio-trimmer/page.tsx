import { Metadata } from "next";
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Audio Trimmer
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
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
