import { Metadata } from "next";
import { Files } from "lucide-react";
import { ImagesToPdfWidget } from "@/components/ImagesToPdfWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Images to PDF | ihatetools",
  description: "Combine multiple images into a single PDF document locally.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Add Your Images",
    description: "Upload one or more JPG or PNG files, then drag to reorder them into the sequence you want in the final PDF.",
  },
  {
    title: "Build the PDF Locally",
    description: "Each image is placed onto its own page and assembled into a single PDF document right in your browser.",
  },
  {
    title: "Download the PDF",
    description: "Save the combined PDF to your device once the pages are arranged the way you want.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Are my images uploaded to a server?",
    answer: "No. Everything runs completely in your browser, so your images and the resulting PDF never leave your device.",
  },
  {
    question: "Can I change the order of the images?",
    answer: "Yes, you can reorder the images before converting, and each one becomes its own page in the final PDF in that order.",
  },
  {
    question: "What image formats are supported?",
    answer: "JPG and PNG files are supported, which covers the vast majority of photos and screenshots you'd want to combine into a PDF.",
  },
  {
    question: "Is there a limit to how many images I can combine?",
    answer: "You can add as many images as your browser's memory comfortably allows; for very large batches, consider converting in smaller groups for best performance.",
  },
];

const RELATED_TOOLS = [
  { name: "Merge PDF", href: "/tools/merge-pdf" },
  { name: "PDF to JPG", href: "/tools/pdf-to-jpg" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function ImagesToPdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Files className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Images to PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Combine JPGs and PNGs into a single PDF document. Everything runs completely in your browser.
        </p>
      </section>

      <ImagesToPdfWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
