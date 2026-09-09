import { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/Frame";
import { SelectedText } from "@/components/SelectedText";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "ihatetools - Free Online Tools",
  description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
};

export default function Home() {
  const allPdfTools = TOOLS.filter(t => t.category === "PDF Tools");
  const allImageTools = TOOLS.filter(t => t.category === "Image Tools");
  const allTextTools = TOOLS.filter(t => t.category === "Text Tools");
  const allAudioAndUtilityTools = TOOLS.filter(
    t => t.category === "Audio Tools" || t.category === "Utility Tools"
  );

  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">

      {/* ======== HERO ======== */}
      <Frame label="Hero" labelColor="yellow" showDim dimText="1120 × 420">
        {/* Stickers */}
        <div className="sticker absolute top-[52px] left-[14px] font-sans font-semibold text-[10px] tracking-[0.05em] uppercase px-[11px] py-[6px] border-[1.5px] border-ink rounded-[5px] bg-yellow text-[#111212] -rotate-[5deg] hidden md:block z-10">
          no sign-up
        </div>
        <div className="sticker absolute top-[96px] right-[16px] font-sans font-semibold text-[10px] tracking-[0.05em] uppercase px-[11px] py-[6px] border-[1.5px] border-ink rounded-[5px] bg-cyan text-[#111212] rotate-[5deg] hidden md:block z-10">
          no watermark
        </div>

        <div className="text-center py-[26px]">
          <h1 className="disp disp-lg text-[clamp(42px,6.6vw,74px)] max-w-[16ch] mx-auto text-ink">
            Tools that <span className="bg-yellow text-[#111212] px-[0.09em]">don&apos;t</span> waste your time.
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
        <div className="grid gap-[20px] max-w-[760px] mx-auto">
          {/* Block 1 */}
          <div className="blk border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-paper mr-0 md:mr-[20%]">
            <span className="absolute top-[34px] right-[-30%] font-handwriting text-[19px] text-grey whitespace-nowrap -rotate-[4deg] hidden lg:block">→ nothing gets uploaded</span>
            <h3 className="disp text-[23px] mb-[9px]">Your files never leave</h3>
            <SelectedText className="mt-[6px]">Everything runs in your browser. No server, no upload, no copy of your document sitting somewhere.</SelectedText>
          </div>
          {/* Block 2 */}
          <div className="blk border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-paper ml-0 md:ml-[20%]">
            <span className="absolute top-[40px] left-[-28%] font-handwriting text-[19px] text-grey whitespace-nowrap rotate-[3deg] hidden lg:block">no catch here ←</span>
            <h3 className="disp text-[23px] mb-[9px]">Free, with no asterisk</h3>
            <SelectedText className="mt-[6px]">No sign-up wall, no watermark on the output, no &quot;upgrade to download&quot; at the last step.</SelectedText>
          </div>
          {/* Block 3 */}
          <div className="blk border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-paper mr-0 md:mr-[20%]">
            <span className="absolute top-[34px] right-[-30%] font-handwriting text-[19px] text-grey whitespace-nowrap -rotate-[3deg] hidden lg:block">→ 60+ and counting</span>
            <h3 className="disp text-[23px] mb-[9px]">One place for all of it</h3>
            <SelectedText className="mt-[6px]">PDF, image, audio, utility, and text tools together, so you&apos;re not hunting for a new site every time.</SelectedText>
          </div>
        </div>
      </Frame>

      {/* ======== CATEGORIES OVERVIEW ======== */}
      <Frame label="Categories" labelColor="cyan">
        <div className="blocks grid gap-[20px] max-w-[760px] mx-auto">
          {/* Block 1: PDF Tools */}
          <Link
            href="/tools/pdf"
            className="blk block border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-paper mr-0 md:mr-[20%] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group"
          >
            <span className="scribble sc1 sc-pdf absolute top-[34px] right-[-30%] font-handwriting text-[19px] whitespace-nowrap -rotate-[4deg] hidden lg:block">
              → {allPdfTools.length} tools inside
            </span>
            <h3 className="disp text-[23px] mb-[9px] text-ink">PDF Tools</h3>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              Merge, split, compress, sign, redact, fill forms, and more — everything for working with PDF files.
            </p>
          </Link>

          {/* Block 2: Image Tools */}
          <Link
            href="/tools/image"
            className="blk block border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-paper ml-0 md:ml-[20%] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group"
          >
            <span className="scribble sc2 sc-img absolute top-[40px] left-[-28%] font-handwriting text-[19px] whitespace-nowrap rotate-[3deg] hidden lg:block">
              {allImageTools.length} tools inside ←
            </span>
            <h3 className="disp text-[23px] mb-[9px] text-ink">Image Tools</h3>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              Compress, resize, crop, convert formats, and touch up your photos in the browser.
            </p>
          </Link>

          {/* Block 3: Text & Dev Tools */}
          <Link
            href="/tools/text"
            className="blk block border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-paper mr-0 md:mr-[20%] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group"
          >
            <span className="scribble sc3 sc-txt absolute top-[34px] right-[-30%] font-handwriting text-[19px] whitespace-nowrap -rotate-[3deg] hidden lg:block">
              → {allTextTools.length} tools inside
            </span>
            <h3 className="disp text-[23px] mb-[9px] text-ink">Text &amp; Dev Tools</h3>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              JSON formatting, word counts, case conversion, and diff checking — quick text utilities.
            </p>
          </Link>

          {/* Block 4: Audio & Utility */}
          <Link
            href="/tools/audio"
            className="blk block border-[1.5px] border-ink rounded-[10px] p-[26px_28px] relative bg-paper ml-0 md:ml-[20%] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group"
          >
            <span className="scribble sc4 sc-aud absolute top-[40px] left-[-28%] font-handwriting text-[19px] whitespace-nowrap rotate-[4deg] hidden lg:block">
              {allAudioAndUtilityTools.length} tools inside ←
            </span>
            <h3 className="disp text-[23px] mb-[9px] text-ink">Audio &amp; Utility</h3>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              Trim and convert audio, generate invoices, passwords, barcodes, and other everyday tools.
            </p>
          </Link>
        </div>
      </Frame>

    </div>
  );
}
