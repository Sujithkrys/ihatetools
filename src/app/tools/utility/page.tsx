import { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Everyday Utility & Developer Tools | ihatetools",
  description: "Free, fast, and private client-side utilities. Barcode generator, bulk renamer, duplicate finder, password generator, UUIDs, hashes, and more.",
};

export default function UtilityToolsPage() {
  const utilityTools = TOOLS.filter((t) => t.category === "Utility Tools");

  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">
      <section className="text-center max-w-2xl mx-auto mb-[60px]">
        <h1 className="disp disp-lg text-[clamp(36px,5vw,52px)] text-ink mb-[12px]">Utility Tools</h1>
        <p className="text-[16px] text-grey tracking-[-0.015em]">
          Everyday utilities and developer tools running 100% locally in your browser.
        </p>
      </section>

      <Frame label="Utility Tools" labelColor="cyan" showBorder={false}>
        <div className="flex items-baseline gap-[14px] mb-[30px]">
          <span className="tag font-sans font-semibold text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] bg-emerald-400 text-[#111212]">
            Utility
          </span>
          <h2 className="disp text-[36px]">Everyday utilities.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {utilityTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </Frame>
    </div>
  );
}
