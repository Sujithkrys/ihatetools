import { Info } from "lucide-react";
import { PdfInfoWidget } from "@/components/PdfInfoWidget";

export const metadata = {
  title: "PDF Info Viewer Free | iHateTools",
  description: "View hidden metadata, page count, PDF version, and properties of any PDF document securely in your browser.",
};

export default function PdfInfoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Info className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          PDF Info Viewer
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Instantly view page count, file size, PDF version, and hidden metadata of any PDF document. Fast, free, and secure.
        </p>
      </section>

      <PdfInfoWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Discover Hidden Document Data</h2>
          <p className="text-grey leading-relaxed mb-6">
            PDF files often contain invisible metadata such as the author name, creation date, and software used to generate the file. This tool extracts and displays all standard document properties in a clean, easy-to-read format directly in your browser.
          </p>
        </section>
      </div>
    </div>
  );
}
