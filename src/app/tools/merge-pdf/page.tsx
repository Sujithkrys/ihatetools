import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

import { PdfMergeWidget } from "@/components/PdfMergeWidget";

export const metadata: Metadata = {
  title: "Merge PDF - Free Online PDF Merger | ihatetools",
  description: "Combine multiple PDF files into one instantly. 100% free, private, client-side merging with no watermarks.",
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
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      {/* Tool Header */}
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          Merge PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Combine multiple PDF files into one single document instantly. 100% secure and runs locally.
        </p>
      </section>

      {/* Main Tool Widget */}
      <ToolWidgetShell>
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
