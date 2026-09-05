import { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { Frame } from "@/components/Frame";
import { SelectedText } from "@/components/SelectedText";
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
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">

      {/* ======== HERO ======== */}
      <Frame label="Hero" labelColor="yellow" showDim dimText="1120 × 420">
        {/* Stickers */}
        <div className="sticker absolute top-[52px] left-[14px] font-mono text-[10px] font-medium tracking-[0.05em] uppercase px-[11px] py-[6px] border-[1.5px] border-ink rounded-[5px] bg-yellow -rotate-[5deg] hidden md:block z-10">
          no sign-up
        </div>
        <div className="sticker absolute top-[96px] right-[16px] font-mono text-[10px] font-medium tracking-[0.05em] uppercase px-[11px] py-[6px] border-[1.5px] border-ink rounded-[5px] bg-cyan rotate-[5deg] hidden md:block z-10">
          no watermark
        </div>

        <div className="text-center py-[26px]">
          <h1 className="disp disp-lg text-[clamp(42px,6.6vw,74px)] max-w-[16ch] mx-auto text-ink">
            Tools that <span className="bg-yellow px-[0.09em]">don&apos;t</span> waste your time.
          </h1>
          <p className="disp text-[clamp(18px,2.5vw,25px)] max-w-[24ch] mx-auto mt-[28px] text-ink/80">
            Merge<span className="inline-block w-[0.7em] h-[0.7em] rounded-[3px] bg-yellow translate-y-[0.02em] mx-[0.08em]" />split, compress and convert<span className="inline-block w-[0.7em] h-[0.7em] rounded-[3px] bg-pink translate-y-[0.02em] mx-[0.08em]" />— all of it running locally in your browser<span className="inline-block w-[0.7em] h-[0.7em] rounded-[3px] bg-cyan translate-y-[0.02em] mx-[0.08em]" />.
          </p>
          <Link
            href="/tools"
            className="cta browse inline-flex gap-[8px] mt-[34px] bg-ink text-paper border-[1.5px] border-ink px-[25px] py-[13px] rounded-[8px] font-medium text-[14.5px] tracking-[-0.02em] cursor-pointer hover:-translate-y-[2px] hover:border-pink transition-all"
          >
            Browse all tools →
          </Link>
        </div>
      </Frame>

      {/* ======== WHY IT'S DIFFERENT ======== */}
      <Frame label="Why it's different" labelColor="pink">
        <div className="grid gap-[20px] max-w-[760px]">
          {/* Block 1 */}
          <div className="blk border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-[#CDEBF7] dark:bg-[#18262C] mr-0 md:mr-[22%]">
            <span className="absolute top-[34px] right-[-30%] font-handwriting text-[19px] text-grey whitespace-nowrap -rotate-[4deg] hidden lg:block">→ nothing gets uploaded</span>
            <h3 className="disp text-[23px] mb-[9px]">Your files never leave</h3>
            <SelectedText className="mt-[6px]">Everything runs in your browser. No server, no upload, no copy of your document sitting somewhere.</SelectedText>
          </div>
          {/* Block 2 */}
          <div className="blk border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-[#FBE7B0] dark:bg-[#2A2417] ml-0 md:ml-[22%]">
            <span className="absolute top-[40px] left-[-28%] font-handwriting text-[19px] text-grey whitespace-nowrap rotate-[3deg] hidden lg:block">no catch here ←</span>
            <h3 className="disp text-[23px] mb-[9px]">Free, with no asterisk</h3>
            <SelectedText className="mt-[6px]">No sign-up wall, no watermark on the output, no &quot;upgrade to download&quot; at the last step.</SelectedText>
          </div>
          {/* Block 3 */}
          <div className="blk border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-[#C6EBDA] dark:bg-[#192720] mr-0 md:mr-[22%]">
            <span className="absolute top-[34px] right-[-30%] font-handwriting text-[19px] text-grey whitespace-nowrap -rotate-[3deg] hidden lg:block">→ 40+ and counting</span>
            <h3 className="disp text-[23px] mb-[9px]">One place for all of it</h3>
            <SelectedText className="mt-[6px]">PDF, image and text tools together, so you&apos;re not hunting for a new site every time.</SelectedText>
          </div>
        </div>
      </Frame>

      {/* ======== PDF TOOLS ======== */}
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

      {/* ======== IMAGE TOOLS ======== */}
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

      {/* ======== TEXT TOOLS ======== */}
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
