import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Audio Tools - Trim, Convert, Compress, Merge & Speech | ihatetools",
  description: "Free, fast, and private client-side audio tools. Trim, convert, compress, synthesize speech, and merge audio clips with zero server uploads.",
};

export default function AudioToolsPage() {
  const audioTools = TOOLS.filter((t) => t.category === "Audio Tools");

  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">Audio Tools</h1>
        <p className="text-[16px] text-grey tracking-[-0.015em]">
          Trim, convert, compress, and synthesize audio with 100% on-device Web Audio processing.
        </p>
      </section>

      <Frame label="Audio Tools" labelColor="yellow" showBorder={false}>
        <div className="flex items-baseline gap-[14px] mb-[30px]">
          <span className="tag font-sans font-semibold text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] bg-amber-400 text-[#111212]">
            Audio
          </span>
          <h2 className="disp text-[36px]">Audio, mastered.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {audioTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>
    </div>
  );
}
