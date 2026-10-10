import { Metadata } from "next";
import { GitCompare } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { PdfCompareWidget } from "@/components/PdfCompareWidget";

export const metadata: Metadata = {
  title: "PDF Compare - Compare Text Differences Between PDFs | ihatetools",
  description: "Compare text differences between two PDF documents online. Highlights added, deleted, and modified sentences side-by-side client-side.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Both PDFs",
    description: "Drop the original document into Box A and the revised version into Box B.",
  },
  {
    title: "Extract Digital Text",
    description: "The tool extracts text streams page-by-page across both documents.",
  },
  {
    title: "Review Differences",
    description: "Additions are highlighted in green and deletions in red, showing every editorial change.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does this compare images or styling differences?",
    answer: "No. This tool specifically performs text-content comparison. Differences in visual margins, font rendering, or images are not compared.",
  },
  {
    question: "Can it compare scanned contracts?",
    answer: "If a PDF is a scanned image without a digital text layer, it must first be processed with OCR to extract selectable text before it can be compared.",
  },
  {
    question: "Is this confidential for legal documents?",
    answer: "Yes, completely safe. The text extraction and diff algorithms run 100% inside your browser memory with zero server transmission.",
  },
];

const RELATED_TOOLS = [
  { name: "Text Diff Checker", href: "/tools/text-diff" },
  { name: "Extract PDF Text", href: "/tools/extract-pdf-text" },
  { name: "Redact PDF", href: "/tools/redact-pdf" },
];

export default function PdfComparePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <GitCompare className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          PDF Compare
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Inspect textual revisions, additions, and deletions between two PDF documents.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / utility / pdf-compare">
        <PdfCompareWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
