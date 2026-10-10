import { Metadata } from "next";
import { ScanText } from "lucide-react";
import { OcrPdfWidget } from "@/components/OcrPdfWidget";

export const metadata: Metadata = {
  title: "OCR PDF - Extract Text from Images and PDF | ihatetools",
  description: "Extract text from scanned PDFs or images using OCR natively in your browser.",
};

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
    </div>
  );
}
