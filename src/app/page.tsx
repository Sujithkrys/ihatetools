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
    <div className="flex flex-col items-center pb-32">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-32 pb-28 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-textPrimary leading-[1.1] mb-8 tracking-tight font-display">
          Free Online Tools. <br className="hidden md:block" />
          <span className="text-textSecondary font-medium">No Watermark, No Sign-up Required.</span>
        </h1>
        <p className="text-xl md:text-2xl text-textSecondary font-normal tracking-tight max-w-2xl mx-auto leading-snug">
          A collection of fast, private, client-side tools designed for developers and creators. Everything runs entirely in your browser.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="w-full max-w-content mx-auto px-4 space-y-24">
        <div>
          <h2 className="text-3xl font-semibold text-textPrimary mb-10">PDF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-textPrimary mb-10">Image Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-textPrimary mb-10">Text & Developer Tools</h2>
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
