import { Metadata } from "next";
import { FileImage } from "lucide-react";
import { PdfToJpgWidget } from "@/components/PdfToJpgWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "PDF to JPG | ihatetools",
  description: "Convert each page of a PDF into a high-quality JPG image.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Choose the PDF document whose pages you want converted into images.",
  },
  {
    title: "Render Each Page as JPG",
    description: "The tool renders every page in your browser and converts it into a high-quality JPG image.",
  },
  {
    title: "Download Your Images",
    description: "Save individual JPG files or download them all together once conversion is complete.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded to a server for conversion?",
    answer: "No. Every page is rendered and converted to JPG entirely in your browser, so the file never leaves your device.",
  },
  {
    question: "What quality are the resulting JPG images?",
    answer: "Pages are extracted at high resolution by default, producing sharp images suitable for viewing, printing, or sharing.",
  },
  {
    question: "Can I convert a multi-page PDF into multiple images?",
    answer: "Yes. Each page of the PDF is converted into its own separate JPG image.",
  },
  {
    question: "Will converting to JPG affect text sharpness compared to PNG?",
    answer: "JPG uses lossy compression, which is great for photos but can slightly soften sharp text and line art compared to a lossless format like PNG.",
  },
];

const RELATED_TOOLS = [
  { name: "PDF to PNG", href: "/tools/pdf-to-png" },
  { name: "Images to PDF", href: "/tools/images-to-pdf" },
  { name: "Extract PDF Images", href: "/tools/extract-pdf-images" },
];

export default function PdfToJpgPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileImage className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          PDF to JPG
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Extract every page of a PDF into a high-quality JPG image entirely in your browser.
        </p>
      </section>

      <PdfToJpgWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
