import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { SplitPdfWidget } from "@/components/SplitPdfWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Split PDF - Free Online PDF Splitter | ihatetools",
  description: "Extract pages or split a PDF into multiple files instantly. 100% free, private, client-side splitting.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload your PDF",
    description: "Drag and drop your PDF into the dropzone. It is processed securely in your browser.",
  },
  {
    title: "Choose Split Mode",
    description: "Extract specific pages or split the document into individual 1-page PDF files.",
  },
  {
    title: "Download",
    description: "Click Split. Download your extracted PDF or a ZIP archive containing all your split pages.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is it safe to split confidential documents?",
    answer: "Yes, completely safe. ihatetools runs entirely in your web browser. Your files are never uploaded to our servers.",
  },
  {
    question: "How do I extract specific pages?",
    answer: "Select the 'Extract page range' mode and type the pages you want (e.g., '1-5' or '1,3,5-7').",
  },
];

const RELATED_TOOLS = [
  { name: "Merge PDF", href: "/tools/merge-pdf" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function SplitPdfPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          Split PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Extract pages or split a PDF into multiple files. 100% secure and runs locally.
        </p>
      </section>

      <ToolWidgetShell>
        <SplitPdfWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
