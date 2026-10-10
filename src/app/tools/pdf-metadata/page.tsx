import { Tags } from "lucide-react";
import { PdfMetadataWidget } from "@/components/PdfMetadataWidget";

export const metadata = {
  title: "Edit PDF Metadata Free | iHateTools",
  description: "View and edit PDF properties like title, author, subject, and keywords.",
};

export default function PdfMetadataPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Tags className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Edit PDF Metadata
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          View and edit PDF properties like title, author, subject, and keywords securely in your browser.
        </p>
      </section>

      <PdfMetadataWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Manage Document Properties</h2>
          <p className="text-grey leading-relaxed mb-6">
            Every PDF contains hidden metadata that describes the document. Use this tool to inspect the current metadata of your file, and easily update the title, author, or keywords before sharing it.
          </p>
        </section>
      </div>
    </div>
  );
}
