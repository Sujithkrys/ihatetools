import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "All Tools | ihatetools",
  description: "Browse all free, fast, and private client-side tools.",
};

export default function AllToolsPage() {
  const pdfTools = TOOLS.filter(t => t.category === "PDF Tools");
  const imageTools = TOOLS.filter(t => t.category === "Image Tools");
  const textTools = TOOLS.filter(t => t.category === "Text Tools");

  return (
    <div className="flex flex-col items-center pt-24 pb-32 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6 font-display tracking-tight leading-tight">
          All Tools
        </h1>
        <p className="text-textSecondary text-xl font-light tracking-tight">
          Browse our complete collection of fast, local, and private utilities.
        </p>
      </section>

      <section className="w-full space-y-24">
        <div>
          <h2 className="text-3xl font-semibold text-accent mb-10">PDF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-accentSecondary mb-10">Image Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-accentTertiary mb-10">Text & Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {textTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
