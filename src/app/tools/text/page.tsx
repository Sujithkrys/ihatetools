import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Text & Developer Tools | ihatetools",
  description: "Free, fast, and private text processing tools for developers and writers.",
};

export default function TextToolsPage() {
  const textTools = TOOLS.filter(t => t.category === "Text Tools");

  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          Text & Developer Tools
        </h1>
        <p className="text-textSecondary text-lg">
          Everything from word counting to JSON formatting, running entirely in your browser.
        </p>
      </section>

      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {textTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
