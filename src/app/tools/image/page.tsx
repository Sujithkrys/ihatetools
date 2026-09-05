import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Image Tools | ihatetools",
  description: "Free, client-side image manipulation and conversion tools.",
};

export default function ImageToolsPage() {
  const imageTools = TOOLS.filter(t => t.category === "Image Tools");

  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Image Tools
        </h1>
        <p className="text-textSecondary text-lg">
          Compress, resize, and convert image formats locally and privately.
        </p>
      </section>

      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
