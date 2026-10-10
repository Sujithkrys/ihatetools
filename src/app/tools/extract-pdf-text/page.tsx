import { Metadata } from "next";
import { Type } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { ExtractPdfTextWidget } from "@/components/ExtractPdfTextWidget";

export const metadata: Metadata = {
  title: "Extract Text from PDF Free | iHateTools",
  description: "Extract the embedded text from your PDF documents instantly securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF document you want to pull text from.",
  },
  {
    title: "Parse the Text Layer",
    description: "The tool reads the PDF's embedded text layer page by page directly in your browser.",
  },
  {
    title: "Copy or Download",
    description: "Review the extracted text and copy it to your clipboard or download it as a plain text file.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Will this work on scanned PDFs or photos saved as PDF?",
    answer: "No, this tool only extracts real embedded text. If your document is a scanned image with no text layer, use our OCR PDF tool instead to recognize and extract the text.",
  },
  {
    question: "Is my document uploaded anywhere?",
    answer: "No. Extraction happens entirely in your browser, so your document contents remain 100% private and are never sent to a server.",
  },
  {
    question: "Does the extracted text keep its original formatting?",
    answer: "The tool extracts plain text content in reading order. Complex layouts like multi-column pages or tables may need manual cleanup afterward.",
  },
  {
    question: "What output formats are available?",
    answer: "You can copy the extracted text directly to your clipboard or download it as a plain .txt file.",
  },
];

const RELATED_TOOLS = [
  { name: "OCR PDF", href: "/tools/ocr-pdf" },
  { name: "Extract PDF Images", href: "/tools/extract-pdf-images" },
  { name: "PDF Info Viewer", href: "/tools/pdf-info" },
];

export default function ExtractPdfTextPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Type className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Extract Text from PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Extract the embedded text from your PDF documents instantly, ready to copy or download.
        </p>
      </section>

      <ExtractPdfTextWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
