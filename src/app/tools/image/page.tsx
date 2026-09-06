import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
import { CategorySectionHeader } from "@/components/CategorySectionHeader";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Image Tools | ihatetools",
  description: "Free, client-side image manipulation and conversion tools.",
};

export default function ImageToolsPage() {
  const imageTools = TOOLS.filter(t => t.category === "Image Tools");

  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">Image Tools</h1>
        <p className="text-[16px] text-grey tracking-[-0.015em]">
          Compress, resize, convert, and edit your images instantly and privately.
        </p>
      </section>

      <Frame label="Image Tools" labelColor="cyan">
        <CategorySectionHeader category="image" tag="Image" title="Images, handled." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {imageTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>
    </div>
  );
}
