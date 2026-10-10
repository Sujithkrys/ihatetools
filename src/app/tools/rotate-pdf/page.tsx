import { RotateCw } from "lucide-react";
import { RotatePdfWidget } from "@/components/RotatePdfWidget";

export const metadata = {
  title: "Rotate PDF Pages Free | iHateTools",
  description: "Rotate all pages in your PDF document instantly. Turn your pages 90 degrees or 180 degrees upside down.",
};

export default function RotatePdfPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <RotateCw className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Rotate PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Rotate all pages in your PDF document instantly in your browser.
        </p>
      </section>

      <RotatePdfWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fix Sideways PDFs Instantly</h2>
          <p className="text-grey leading-relaxed mb-6">
            Scanned a document upside down or sideways? This tool allows you to apply a bulk 90-degree or 180-degree rotation to every single page in your document instantly. 
            No more reading with a tilted head.
          </p>
        </section>
      </div>
    </div>
  );
}
