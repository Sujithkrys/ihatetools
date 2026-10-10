import { ImagePlay } from "lucide-react";
import { PdfToPngWidget } from "@/components/PdfToPngWidget";

export const metadata = {
  title: "PDF to PNG Converter Free | iHateTools",
  description: "Convert your PDF pages to high-quality PNG images securely in your browser with transparent rendering options.",
};

export default function PdfToPngPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
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

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Lossless Image Extraction</h2>
          <p className="text-grey leading-relaxed mb-6">
            While JPEG is great for photos, PNG is a lossless format that excels at rendering sharp text, line art, and graphics. Use this tool when you need pixel-perfect representations of your PDF pages without the compression artifacts associated with JPEGs.
          </p>
        </section>
      </div>
    </div>
  );
}
