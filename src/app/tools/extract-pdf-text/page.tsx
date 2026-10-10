import { Type } from "lucide-react";
import { ExtractPdfTextWidget } from "@/components/ExtractPdfTextWidget";

export const metadata = {
  title: "Extract Text from PDF Free | iHateTools",
  description: "Extract the embedded text from your PDF documents instantly securely in your browser.",
};

export default function ExtractPdfTextPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Type className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Extract Text from PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Extract the embedded text from your PDF documents instantly, ready to copy or download.
        </p>
      </section>

      <ExtractPdfTextWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fast Text Extraction</h2>
          <p className="text-grey leading-relaxed mb-6">
            If your PDF has real embedded text (not just scanned images), this tool will instantly extract it into a clean, copyable format. Since it runs entirely in your browser, your document contents remain 100% private and secure. 
            If your document is scanned, try our OCR tool instead.
          </p>
        </section>
      </div>
    </div>
  );
}
