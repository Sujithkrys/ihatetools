import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "ihatetools - Free Online Tools",
  description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
};

export default function Home() {
  const pdfTools = TOOLS.filter(t => t.category === "PDF Tools");
  const imageTools = TOOLS.filter(t => t.category === "Image Tools");
  const textTools = TOOLS.filter(t => t.category === "Text Tools");

  return (
    <div className="flex flex-col items-center pb-24">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary leading-tight mb-6 tracking-tight">
          Free Online Tools. <br className="hidden md:block" />
          <span className="text-accent">No Watermark, No Sign-up Required.</span>
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          A collection of fast, private, client-side tools designed for developers and creators. Everything runs entirely in your browser.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="w-full max-w-content mx-auto px-4 space-y-16">
        <div>
          <h2 className="text-2xl font-semibold text-textPrimary mb-8">PDF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-textPrimary mb-8">Image Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-textPrimary mb-8">Text & Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
