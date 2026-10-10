import { Metadata } from "next";
import { FileDigit } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { AddPageNumbersWidget } from "@/components/AddPageNumbersWidget";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Free | iHateTools",
  description: "Easily add page numbers to your PDF documents in seconds.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Drag and drop or select the PDF file you want to paginate.",
  },
  {
    title: "Choose Position & Start Number",
    description: "Pick where the numbers should appear on the page, such as bottom-center, and set the starting digit.",
  },
  {
    title: "Generate & Download",
    description: "The numbers are stamped onto every page in your browser, then you download the finished PDF.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded to a server?",
    answer: "No. The page numbering is performed entirely in your browser using client-side PDF libraries, so your document never leaves your device.",
  },
  {
    question: "Can I choose where the page numbers appear?",
    answer: "Yes. You can select the position, such as bottom-center or another corner, before generating the numbered PDF.",
  },
  {
    question: "Can I start numbering from a page other than 1?",
    answer: "Yes. You can set a custom starting number, which is useful when your PDF continues from an earlier printed document.",
  },
  {
    question: "Will this work with large or scanned PDFs?",
    answer: "Yes, as long as the file is a valid PDF. Very large files may take a few extra seconds since processing happens on your own device rather than a remote server.",
  },
];

const RELATED_TOOLS = [
  { name: "Add Watermark", href: "/tools/add-watermark" },
  { name: "Rotate PDF", href: "/tools/rotate-pdf" },
  { name: "Delete PDF Pages", href: "/tools/delete-pdf-pages" },
];

export default function AddPageNumbersPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileDigit className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Add Page Numbers
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Add page numbers to your PDF documents in seconds directly in your browser.
        </p>
      </section>

      <AddPageNumbersWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
