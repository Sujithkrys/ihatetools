import { Metadata } from "next";
import { Layers } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

import { PdfMergeWidget } from "@/components/PdfMergeWidget";

export const metadata: Metadata = {
  title: "Merge PDF - Free Online PDF Merger | ihatetools",
  description: "Combine multiple PDF files into one instantly. 100% free, private, client-side merging with no watermarks.",
  alternates: {
    canonical: "/tools/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF - Free Online PDF Merger | ihatetools",
    description: "Combine multiple PDF files into one instantly. 100% free, private, client-side merging with no watermarks.",
    url: "/tools/merge-pdf",
  },
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload your PDFs",
    description: "Drag and drop the PDF files you want to merge into the dropzone. You can add as many files as you need.",
  },
  {
    title: "Reorder pages",
    description: "Drag the files to rearrange them in the exact order you want them to appear in the final merged document.",
  },
  {
    title: "Merge & Download",
    description: "Click merge and your new combined PDF will be ready instantly. Everything happens locally in your browser.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is it safe to merge confidential documents here?",
    answer: "Yes, completely safe. ihatetools runs entirely in your web browser using client-side processing. Your files are never uploaded to our servers, meaning your confidential data never leaves your device.",
  },
  {
    question: "Is there a limit on how many PDFs I can merge?",
    answer: "There are no hard limits. You can merge as many files as you want, provided your device has enough memory to process them.",
  },
  {
    question: "Will merging reduce the quality of my PDFs?",
    answer: "No. The merging process combines the original pages exactly as they are without re-compressing or altering the visual quality.",
  },
  {
    question: "Does this work on mobile devices?",
    answer: "Yes! As long as you have a modern web browser, you can merge PDFs directly on your phone or tablet.",
  },
];

const RELATED_TOOLS = [
  { name: "Split PDF", href: "/tools/split-pdf" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function MergePdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      {/* Tool Header */}
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Layers className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Merge PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Combine multiple PDF files into one single document instantly. 100% secure and runs locally.
        </p>
      </section>

      {/* Main Tool Widget */}
      <ToolWidgetShell breadcrumbs="ihatetools / pdf / merge">
        <PdfMergeWidget />
      </ToolWidgetShell>

      {/* How it Works */}
      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />

      {/* FAQ */}
      <FAQAccordion items={FAQ_ITEMS} />

      {/* Related Tools */}
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
