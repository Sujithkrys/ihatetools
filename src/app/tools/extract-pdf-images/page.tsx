import { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { ExtractPdfImagesWidget } from "@/components/ExtractPdfImagesWidget";

export const metadata: Metadata = {
  title: "Extract Images from PDF Free | iHateTools",
  description: "Extract the embedded raw images from your PDF documents instantly securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF document containing the images you want to pull out.",
  },
  {
    title: "Scan for Embedded Images",
    description: "The tool reads the PDF's internal structure to locate every embedded XObject image, rather than just rendering pages as screenshots.",
  },
  {
    title: "Download Your Images",
    description: "Preview the extracted images and download them individually or as a batch, in their original quality.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Are the images extracted at full original quality?",
    answer: "Yes. The tool locates the original embedded image data (XObjects) inside the PDF rather than rendering and re-compressing the page, so you get the source image as it was embedded.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer: "No. The extraction runs entirely client-side in your browser, so your confidential files are never uploaded anywhere.",
  },
  {
    question: "What if my PDF has no extractable images?",
    answer: "If a PDF only contains text or vector graphics, or is a scanned document saved as one big page image, the tool will report no separable images found.",
  },
  {
    question: "What format are the extracted images saved in?",
    answer: "Images are exported in their original embedded format, typically JPG or PNG, matching how they were stored in the PDF.",
  },
];

const RELATED_TOOLS = [
  { name: "Extract PDF Text", href: "/tools/extract-pdf-text" },
  { name: "PDF to JPG", href: "/tools/pdf-to-jpg" },
  { name: "Images to PDF", href: "/tools/images-to-pdf" },
];

export default function ExtractPdfImagesPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ImageIcon className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Extract Images from PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Extract all embedded images and photos from your PDF documents instantly, ready to download.
        </p>
      </section>

      <ExtractPdfImagesWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
