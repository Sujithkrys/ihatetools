import { FileMinus } from "lucide-react";
import { DeletePdfPagesWidget } from "@/components/DeletePdfPagesWidget";

export const metadata = {
  title: "Delete PDF Pages Free | iHateTools",
  description: "Remove unwanted pages from your PDF documents securely in your browser.",
};

export default function DeletePdfPagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileMinus className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Delete PDF Pages
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Remove unwanted pages from your PDF documents securely in your browser.
        </p>
      </section>

      <DeletePdfPagesWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Trim Your PDF Documents</h2>
          <p className="text-grey leading-relaxed mb-6">
            Instantly remove blank pages, extra forms, or unnecessary content from your PDF files. Select the exact pages you want to eliminate using our visual preview grid and download a clean, updated document.
          </p>
        </section>
      </div>
    </div>
  );
}
