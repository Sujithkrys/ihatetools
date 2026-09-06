import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
import { CategorySectionHeader } from "@/components/CategorySectionHeader";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "PDF Tools | ihatetools",
  description: "Free, client-side PDF manipulation tools.",
};

export default function PdfToolsPage() {
  const pdfTools = TOOLS.filter(t => t.category === "PDF Tools");

  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">PDF Tools</h1>
        <p className="text-[16px] text-grey tracking-[-0.015em]">
          Merge, split, compress, and organize your PDF files entirely in your browser.
        </p>
      </section>

      <Frame label="PDF Tools" labelColor="yellow">
        <CategorySectionHeader category="pdf" tag="PDF" title="PDF, sorted." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>
    </div>
  );
}
