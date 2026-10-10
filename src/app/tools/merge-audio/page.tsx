import { Metadata } from "next";
import { Layers } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { MergeAudioWidget } from "@/components/MergeAudioWidget";

export const metadata: Metadata = {
  title: "Merge Audio Files - Combine Audio Clips Online | ihatetools",
  description: "Combine and join multiple audio files into a single continuous track. Reorder clips, preview individual sounds, and export to MP3 or WAV.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Audio Tracks",
    description: "Add multiple audio files (MP3, WAV, AAC, M4A, OGG).",
  },
  {
    title: "Reorder & Preview",
    description: "Use the up/down arrows to order your tracks chronologically and audition individual clips.",
  },
  {
    title: "Concatenate & Export",
    description: "Merge all clips seamlessly into a single track with matching cumulative duration.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Can I merge different audio formats together?",
    answer: "Yes! You can upload a mix of MP3, WAV, AAC, and OGG files; they are decoded into unified PCM audio buffers and exported as a single uniform file.",
  },
  {
    question: "Does merging keep the exact length of each clip?",
    answer: "Yes. The total merged duration equals the exact mathematical sum of each input track's duration.",
  },
  {
    question: "What output formats are supported?",
    answer: "You can export the merged master file as an MP3 (128, 192, or 320 kbps) or lossless 16-bit PCM WAV.",
  },
];

const RELATED_TOOLS = [
  { name: "Audio Trimmer", href: "/tools/audio-trimmer" },
  { name: "Audio Format Converter", href: "/tools/audio-converter" },
  { name: "Merge PDF", href: "/tools/merge-pdf" },
];

export default function MergeAudioPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Layers className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Audio Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Merge Audio Files
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Concatenate multiple songs, podcasts, and recordings into one continuous file.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / audio / merge">
        <MergeAudioWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
