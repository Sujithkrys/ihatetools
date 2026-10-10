import { Metadata } from "next";
import { ScanText } from "lucide-react";
import { OcrPdfWidget } from "@/components/OcrPdfWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "OCR PDF - Extract Text from Images and PDF | ihatetools",
  description: "Extract text from scanned PDFs or images using OCR natively in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Scanned PDF",
    description: "Choose a scanned PDF or image-based file that contains text your computer cannot yet select or search.",
  },
  {
    title: "On-Device Text Recognition",
    description: "The OCR engine analyzes each page in your browser, identifying characters and words without uploading the file anywhere.",
  },
  {
    title: "Download Searchable Text",
    description: "Review the recognized text and export it, so your document becomes searchable and copyable.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my document uploaded to a server for OCR processing?",
    answer: "No. The recognition runs entirely in your browser using local processing, so your file never leaves your device.",
  },
  {
    question: "How accurate is the text recognition?",
    answer: "Accuracy depends on scan quality, but clear, high-resolution scans with standard fonts typically recognize with very high accuracy. Blurry or handwritten text may need manual correction.",
  },
  {
    question: "Which languages and file types are supported?",
    answer: "The tool supports common document languages and accepts scanned PDFs as well as image files like JPG and PNG that contain text.",
  },
  {
    question: "Is there a limit on file size or page count?",
    answer: "Since processing happens on your device, very large files may take longer or use more memory depending on your browser and hardware, but there is no server-imposed size limit.",
  },
];

const RELATED_TOOLS = [
  { name: "Extract PDF Text", href: "/tools/extract-pdf-text" },
  { name: "PDF to JPG", href: "/tools/pdf-to-jpg" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function OcrPdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ScanText className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          OCR PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Extract text from scanned PDFs or images using OCR locally in your browser.
        </p>
      </section>
      <OcrPdfWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
