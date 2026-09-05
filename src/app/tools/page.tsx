import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
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
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">All Tools</h1>
        <p className="text-[16px] text-grey tracking-[-0.015em]">
          Browse our complete collection of fast, local, and private utilities.
        </p>
      </section>

      <Frame label="PDF Tools" labelColor="yellow">
        <div className="flex items-baseline gap-[14px] mb-[30px]">
          <span className="tag font-mono text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] bg-yellow">PDF</span>
          <h2 className="disp text-[36px]">PDF, sorted.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>

      <Frame label="Image Tools" labelColor="cyan">
        <div className="flex items-baseline gap-[14px] mb-[30px]">
          <span className="tag font-mono text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] bg-cyan">Image</span>
          <h2 className="disp text-[36px]">Images, handled.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {imageTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>

      <Frame label="Text & Dev" labelColor="violet">
        <div className="flex items-baseline gap-[14px] mb-[30px]">
          <span className="tag font-mono text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] bg-violet">Text</span>
          <h2 className="disp text-[36px]">Text utilities.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {textTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>
    </div>
  );
}
