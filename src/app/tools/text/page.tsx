import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
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
        <div className="flex items-baseline gap-[14px] mb-[30px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] shadow-hard-sm bg-violet">Text</span>
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
