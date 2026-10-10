import { Metadata } from "next";
import { ImagePlay } from "lucide-react";
import { PdfToPngWidget } from "@/components/PdfToPngWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "PDF to PNG Converter Free | iHateTools",
  description: "Convert your PDF pages to high-quality PNG images securely in your browser with transparent rendering options.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF document whose pages you want to export as images.",
  },
  {
    title: "Render Pages to PNG",
    description: "Each page is rendered in your browser and converted into a lossless PNG image, preserving sharp text and fine detail.",
  },
  {
    title: "Download Your PNG Files",
    description: "Save the converted images individually or all at once once processing finishes.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded to a server for the conversion?",
    answer: "No. Page rendering and PNG conversion happen entirely in your browser, so your document is never sent anywhere.",
  },
  {
    question: "Why choose PNG instead of JPG?",
    answer: "While JPEG is great for photos, PNG is a lossless format that excels at rendering sharp text, line art, and graphics. Use PNG when you need pixel-perfect representations of your PDF pages without the compression artifacts associated with JPEGs.",
  },
  {
    question: "Does PNG support transparent backgrounds?",
    answer: "Yes. PNG supports transparency, so pages with transparent elements can be exported without a solid background if the source content supports it.",
  },
  {
    question: "Will my PNG files be larger than JPG equivalents?",
    answer: "Generally yes, since PNG is lossless and does not compress as aggressively as JPG, resulting in larger but higher-fidelity files.",
  },
];

const RELATED_TOOLS = [
  { name: "PDF to JPG", href: "/tools/pdf-to-jpg" },
  { name: "Extract PDF Images", href: "/tools/extract-pdf-images" },
  { name: "Images to PDF", href: "/tools/images-to-pdf" },
];

export default function PdfToPngPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ImagePlay className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          PDF to PNG Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Convert your PDF document into high-quality PNG images instantly.
        </p>
      </section>

      <PdfToPngWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
