import { Metadata } from "next";
import { Tags } from "lucide-react";
import { PdfMetadataWidget } from "@/components/PdfMetadataWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Edit PDF Metadata Free | iHateTools",
  description: "View and edit PDF properties like title, author, subject, and keywords.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF whose document properties you want to inspect or change.",
  },
  {
    title: "Edit the Properties",
    description: "Update fields such as title, author, subject, and keywords directly in the editor.",
  },
  {
    title: "Save the Updated PDF",
    description: "Download your PDF with the new metadata applied, ready to share with accurate document details.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded to a server to edit its metadata?",
    answer: "No. Every PDF contains hidden metadata that describes the document, and this tool reads and rewrites those fields entirely in your browser, so your file never leaves your device.",
  },
  {
    question: "Which metadata fields can I change?",
    answer: "You can inspect the current metadata of your file and update the title, author, subject, and keywords before sharing it.",
  },
  {
    question: "Does editing metadata change the PDF's content?",
    answer: "No. Only the document properties are updated; the pages, text, and images inside the PDF remain untouched.",
  },
  {
    question: "Why would I want to edit PDF metadata?",
    answer: "Accurate metadata helps with document organization, search indexing, and removing personal details like an author name before sharing a file publicly.",
  },
];

const RELATED_TOOLS = [
  { name: "PDF Info Viewer", href: "/tools/pdf-info" },
  { name: "Redact PDF", href: "/tools/redact-pdf" },
  { name: "Protect PDF", href: "/tools/add-password" },
];

export default function PdfMetadataPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Tags className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Edit PDF Metadata
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          View and edit PDF properties like title, author, subject, and keywords securely in your browser.
        </p>
      </section>

      <PdfMetadataWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
