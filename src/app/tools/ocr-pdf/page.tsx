import { Metadata } from "next";
import { OcrPdfWidget } from "@/components/OcrPdfWidget";

export const metadata: Metadata = {
  title: "OCR PDF - Extract Text from Images and PDF | ihatetools",
  description: "Extract text from scanned PDFs or images using OCR natively in your browser.",
};

export default function OcrPdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          OCR PDF
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Extract text from scanned PDFs or images using OCR locally in your browser.
        </p>
      </section>
      <OcrPdfWidget />
    </div>
  );
}
