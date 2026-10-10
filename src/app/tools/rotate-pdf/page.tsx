import { Metadata } from "next";
import { RotateCw } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { RotatePdfWidget } from "@/components/RotatePdfWidget";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Free | iHateTools",
  description: "Rotate all pages in your PDF document instantly. Turn your pages 90 degrees or 180 degrees upside down.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select or drag in the scanned or exported PDF that has sideways or upside-down pages.",
  },
  {
    title: "Choose a Rotation Angle",
    description: "Apply a 90 degree, 180 degree, or 270 degree turn across all pages at once.",
  },
  {
    title: "Download the Corrected PDF",
    description: "Save a new PDF with every page facing the right way, ready to read or print.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does this rotate every page or just one?",
    answer: "By default it applies the chosen rotation to every page in the document, so a batch of sideways scans is fixed in one pass.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer: "No. The rotation is processed locally in your browser, so your document never leaves your device during the process.",
  },
  {
    question: "Will rotating affect the PDF's text or image quality?",
    answer: "No. Rotation only changes the page orientation metadata and layout; the underlying text, images, and resolution remain unchanged.",
  },
  {
    question: "Is there a limit on file size or page count?",
    answer: "Rotation runs in your browser's memory, so very large PDFs with hundreds of pages may take a moment longer, but there is no artificial page limit.",
  },
];

const RELATED_TOOLS = [
  { name: "Organize PDF", href: "/tools/organize-pdf" },
  { name: "Delete PDF Pages", href: "/tools/delete-pdf-pages" },
  { name: "Merge PDF", href: "/tools/merge-pdf" },
];

export default function RotatePdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <RotateCw className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Rotate PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Rotate all pages in your PDF document instantly in your browser.
        </p>
      </section>

      <RotatePdfWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
