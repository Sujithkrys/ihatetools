import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "PDF Tools | ihatetools",
  description: "Free, client-side PDF manipulation tools.",
};

export default function PdfToolsPage() {
  const pdfTools = TOOLS.filter(t => t.category === "PDF Tools");

  return (
    <div className="flex flex-col items-center pt-24 pb-32 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6 font-display tracking-tight leading-tight">
          PDF Tools
        </h1>
        <p className="text-textSecondary text-xl font-light tracking-tight">
          Merge, split, compress, and organize your PDF files entirely in your browser.
        </p>
      </section>

      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
