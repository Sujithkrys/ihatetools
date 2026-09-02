import { Metadata } from "next";
import { OcrPdfWidget } from "@/components/OcrPdfWidget";

export const metadata: Metadata = {
  title: "OCR PDF - Extract Text from Images and PDF | ihatetools",
  description: "Extract text from scanned PDFs or images using OCR natively in your browser.",
};

export default function OcrPdfPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          OCR PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Extract text from scanned PDFs or images using OCR locally in your browser.
        </p>
      </section>
      <OcrPdfWidget />
    </div>
  );
}
