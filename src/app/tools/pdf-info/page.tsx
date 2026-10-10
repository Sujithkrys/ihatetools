import { Metadata } from "next";
import { Info } from "lucide-react";
import { PdfInfoWidget } from "@/components/PdfInfoWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "PDF Info Viewer Free | iHateTools",
  description: "View hidden metadata, page count, PDF version, and properties of any PDF document securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF document whose properties and hidden details you want to inspect.",
  },
  {
    title: "Automatic Property Scan",
    description: "The tool reads the file's internal structure in your browser to surface page count, file size, PDF version, and metadata fields.",
  },
  {
    title: "Review the Results",
    description: "View everything, such as the author, creation date, and software used, in a clean, organized summary.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded anywhere to view its info?",
    answer: "No. The file is read entirely in your browser, so no copy of your document is sent to a server.",
  },
  {
    question: "What hidden metadata can this tool reveal?",
    answer: "PDF files often contain invisible metadata such as the author name, creation and modification dates, and the software used to generate the file. This tool extracts and displays all standard document properties in a clean, easy-to-read format.",
  },
  {
    question: "Does this tool modify my PDF?",
    answer: "No. It only reads and displays information; your original file is left completely unchanged.",
  },
  {
    question: "Can I check the PDF version and page count this way?",
    answer: "Yes. Alongside metadata, the tool also displays the PDF version, total page count, and file size.",
  },
];

const RELATED_TOOLS = [
  { name: "Edit PDF Metadata", href: "/tools/pdf-metadata" },
  { name: "PDF Compare", href: "/tools/pdf-compare" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function PdfInfoPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Info className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          PDF Info Viewer
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Instantly view page count, file size, PDF version, and hidden metadata of any PDF document. Fast, free, and secure.
        </p>
      </section>

      <PdfInfoWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
