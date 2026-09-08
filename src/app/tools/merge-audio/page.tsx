import { Metadata } from "next";
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Merge Audio Files
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
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
