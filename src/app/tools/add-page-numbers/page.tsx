import { FileDigit } from "lucide-react";
import { AddPageNumbersWidget } from "@/components/AddPageNumbersWidget";

export const metadata = {
  title: "Add Page Numbers to PDF Free | iHateTools",
  description: "Easily add page numbers to your PDF documents in seconds.",
};

export default function AddPageNumbersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileDigit className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Add Page Numbers
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Add page numbers to your PDF documents in seconds directly in your browser.
        </p>
      </section>

      <AddPageNumbersWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Number Your Pages Instantly</h2>
          <p className="text-grey leading-relaxed mb-6">
            Easily paginate your PDF files. Choose exactly where you want the numbers to appear and specify the starting digit for seamless integration with existing documents.
          </p>
        </section>
      </div>
    </div>
  );
}
