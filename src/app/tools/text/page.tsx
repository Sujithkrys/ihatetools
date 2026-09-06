import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
import { CategorySectionHeader } from "@/components/CategorySectionHeader";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Text & Developer Tools | ihatetools",
  description: "Free, fast, and private text processing tools for developers and writers.",
};

export default function TextToolsPage() {
  const textTools = TOOLS.filter(t => t.category === "Text Tools");

  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">Text & Dev Tools</h1>
        <p className="text-[16px] text-grey tracking-[-0.015em]">
          Everything from word counting to JSON formatting, running entirely in your browser.
        </p>
      </section>

      <Frame label="Text & Dev" labelColor="violet">
        <CategorySectionHeader category="text" tag="Text" title="Text utilities." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {textTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>
    </div>
  );
}
