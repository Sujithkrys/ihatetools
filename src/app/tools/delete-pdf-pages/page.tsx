import { Metadata } from "next";
import { FileMinus } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { DeletePdfPagesWidget } from "@/components/DeletePdfPagesWidget";

export const metadata: Metadata = {
  title: "Delete PDF Pages Free | iHateTools",
  description: "Remove unwanted pages from your PDF documents securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF document you want to trim pages from.",
  },
  {
    title: "Select Pages to Remove",
    description: "Browse the visual page grid and pick the exact pages you no longer need.",
  },
  {
    title: "Download the Updated PDF",
    description: "The selected pages are stripped out and a clean, updated PDF is generated for download.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded to a server?",
    answer: "No. Pages are removed entirely in your browser using client-side PDF processing, so your document never leaves your device.",
  },
  {
    question: "Can I delete multiple pages at once?",
    answer: "Yes. You can select any number of pages, in any order, using the visual preview grid before generating the updated file.",
  },
  {
    question: "Will the remaining pages keep their original quality?",
    answer: "Yes. Only the selected pages are removed; the rest of the document retains its original content and resolution.",
  },
  {
    question: "Does this work on password-protected PDFs?",
    answer: "You'll need to unlock the PDF first using a password removal tool before pages can be deleted.",
  },
];

const RELATED_TOOLS = [
  { name: "Organize PDF", href: "/tools/organize-pdf" },
  { name: "Split PDF", href: "/tools/split-pdf" },
  { name: "Unlock PDF", href: "/tools/remove-password" },
];

export default function DeletePdfPagesPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileMinus className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Delete PDF Pages
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Remove unwanted pages from your PDF documents securely in your browser.
        </p>
      </section>

      <DeletePdfPagesWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
