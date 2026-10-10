import { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/Frame";
import { SelectedText } from "@/components/SelectedText";
import { TOOLS } from "@/lib/tools-data";
import { Footer } from "@/components/Footer";

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
    <>
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">

      {/* ======== HERO ======== */}
      <Frame showBorder={false}>
        <div className="text-center py-[26px]">
          <div className="inline-flex items-center gap-[14px] mb-[22px]">
            <span className="inline-flex items-center gap-[6px] text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[11px] py-[5px] rounded-full">
              No sign-up
            </span>
            <span className="inline-flex items-center gap-[6px] text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[11px] py-[5px] rounded-full">
              No watermark
            </span>
          </div>
          <h1 className="disp disp-lg text-[clamp(34px,5vw,54px)] max-w-[16ch] mx-auto text-ink">
            Tools that <span className="bg-yellow/90 text-[#111212] px-[0.1em] rounded-[0.15em]">don&apos;t</span> waste your time.
          </h1>
          <p className="disp text-[clamp(16px,2vw,20px)] font-normal max-w-[30ch] mx-auto mt-[22px] text-ink/65">
            Merge, split, compress, and convert, all of it running locally in your browser.
          </p>
          <Link
            href="/tools"
            className="cta browse inline-flex items-center gap-[8px] mt-[32px] bg-ink text-paper px-[24px] py-[12px] rounded-[10px] font-medium text-[14.5px] tracking-[-0.02em] cursor-pointer shadow-soft dark:shadow-soft-dark hover:-translate-y-[2px] hover:shadow-soft-hover transition-all"
          >
            Browse all tools →
          </Link>
        </div>
      </Frame>

      {/* ======== WHY IT'S DIFFERENT ======== */}
      <Frame label="Why it's different" labelColor="pink">
        <div className="grid md:grid-cols-3 gap-[18px] max-w-[920px] mx-auto">
          <div className="blk p-[26px_24px]">
            <h3 className="disp text-[20px] mb-[9px]">Your files never leave</h3>
            <SelectedText className="mt-[6px]">Everything runs in your browser. No server, no upload, no copy of your document sitting somewhere.</SelectedText>
          </div>
          <div className="blk p-[26px_24px]">
            <h3 className="disp text-[20px] mb-[9px]">Free, with no asterisk</h3>
            <SelectedText className="mt-[6px]">No sign-up wall, no watermark on the output, no &quot;upgrade to download&quot; at the last step.</SelectedText>
          </div>
          <div className="blk p-[26px_24px]">
            <h3 className="disp text-[20px] mb-[9px]">One place for all of it</h3>
            <SelectedText className="mt-[6px]">PDF, image, audio, utility, and text tools together, so you&apos;re not hunting for a new site every time.</SelectedText>
          </div>
        </div>
      </Frame>

      {/* ======== CATEGORIES OVERVIEW ======== */}
      <Frame label="Categories" labelColor="cyan">
        <div className="blocks grid md:grid-cols-2 gap-[18px] max-w-[920px] mx-auto">
          <Link href="/tools/pdf" className="blk block p-[26px_24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center justify-between mb-[9px]">
              <h3 className="disp text-[20px] text-ink">PDF Tools</h3>
              <span className="text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allPdfTools.length} tools</span>
            </div>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              Merge, split, compress, sign, redact, fill forms, and more, everything for working with PDF files.
            </p>
          </Link>

          <Link href="/tools/image" className="blk block p-[26px_24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center justify-between mb-[9px]">
              <h3 className="disp text-[20px] text-ink">Image Tools</h3>
              <span className="text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allImageTools.length} tools</span>
            </div>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              Compress, resize, crop, convert formats, and touch up your photos in the browser.
            </p>
          </Link>

          <Link href="/tools/text" className="blk block p-[26px_24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center justify-between mb-[9px]">
              <h3 className="disp text-[20px] text-ink">Text &amp; Dev Tools</h3>
              <span className="text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allTextTools.length} tools</span>
            </div>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              JSON formatting, word counts, case conversion, and diff checking, quick text utilities.
            </p>
          </Link>

          <Link href="/tools/audio" className="blk block p-[26px_24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center justify-between mb-[9px]">
              <h3 className="disp text-[20px] text-ink">Audio &amp; Utility</h3>
              <span className="text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allAudioAndUtilityTools.length} tools</span>
            </div>
            <p className="text-[14.5px] leading-[1.55] text-grey">
              Trim and convert audio, generate invoices, passwords, barcodes, and other everyday tools.
            </p>
          </Link>
        </div>
      </Frame>
    </div>
    <Footer />
    </>
  );
}
