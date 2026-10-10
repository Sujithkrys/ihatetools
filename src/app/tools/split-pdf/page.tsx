import { Metadata } from "next";
import { SplitSquareHorizontal } from "lucide-react";
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
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <SplitSquareHorizontal className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Split PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Extract pages or split a PDF into multiple files. 100% secure and runs locally.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / pdf / split">
        <SplitPdfWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
