import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Ban, Layers, Gauge } from "lucide-react";
import { Frame } from "@/components/Frame";
import { SelectedText } from "@/components/SelectedText";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "About | ihatetools",
  description: `ihatetools is a collection of ${TOOLS.length}+ free, client-side PDF, image, audio, and text tools. No uploads, no sign-up, no watermarks.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | ihatetools",
    description: `ihatetools is a collection of ${TOOLS.length}+ free, client-side PDF, image, audio, and text tools. No uploads, no sign-up, no watermarks.`,
    url: "/about",
  },
};

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Your files never leave your device",
    text: "Every tool runs entirely in your browser using client-side JavaScript. When you merge a PDF or compress an image, the file is processed on your machine, not uploaded to a server. We never see it, store it, or get the chance to.",
  },
  {
    icon: Ban,
    title: "Free with no catch",
    text: "No sign-up wall, no email capture, no \"upgrade to download,\" no watermark slapped on your output. If a tool is listed, you can use it right now, for free, as many times as you want.",
  },
  {
    icon: Layers,
    title: "One place, not a dozen bookmarks",
    text: `${TOOLS.length}+ tools across PDFs, images, audio, and everyday text and developer utilities, all built with the same interface so you're not relearning a new site every time you need something different.`,
  },
  {
    icon: Gauge,
    title: "Built to be fast, not bloated",
    text: "No accounts to create, no file size limits padded by server queues, no ads interrupting the task. Open a tool, do the thing, close the tab.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[48px] pb-[80px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">ABOUT</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[34px] text-ink leading-[1.2] mb-3.5">
          Tools that respect your files and your time
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[58ch]">
          ihatetools is a free collection of {TOOLS.length}+ PDF, image, audio, and text utilities that run entirely in your browser. No uploads, no sign-up, no watermarks.
        </p>
      </section>

      <Frame label="Why it exists" labelColor="cyan">
        <div className="max-w-3xl space-y-6 text-[16px] text-grey leading-[1.7] tracking-[-0.005em]">
          <SelectedText className="w-full">
            Most free online tools pay for their servers by making you pay in other ways: an account you didn&apos;t want, a watermark on your result, a file size cap designed to push you toward a paid plan, or your document sitting on someone else&apos;s server longer than you&apos;d like. We built ihatetools because that tradeoff is unnecessary for most everyday tasks.
          </SelectedText>
          <p>
            Compressing an image, merging a PDF, or formatting a block of JSON doesn&apos;t need a backend at all, modern browsers are fast enough to do this work locally. So that&apos;s how every tool here is built. Your file is read, processed, and handed back to you without ever being sent anywhere.
          </p>
        </div>
      </Frame>

      <Frame label="What we believe" labelColor="violet">
        <div className="grid sm:grid-cols-2 gap-[14px] max-w-3xl">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="blk p-[18px] !bg-paper dark:!bg-bg">
                <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center mb-3">
                  <Icon className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
                </div>
                <h3 className="text-[15px] font-semibold text-ink mb-1.5 leading-tight">{p.title}</h3>
                <p className="text-[13.5px] leading-[1.6] text-grey">{p.text}</p>
              </div>
            );
          })}
        </div>
      </Frame>

      <Frame label="What's next" labelColor="green">
        <div className="max-w-3xl space-y-4 text-[16px] text-grey leading-[1.7] tracking-[-0.005em]">
          <p>
            We keep adding tools and keep refining the ones already live, based on what people actually use and ask for. If there&apos;s a tool you wish existed, or something on the site that&apos;s broken or confusing, we want to hear about it.
          </p>
          <p>
            Start with the <Link href="/" className="text-sel font-medium hover:underline">full tools directory</Link>, or read the <Link href="/blog" className="text-sel font-medium hover:underline">guides on the blog</Link> for a walkthrough of specific tasks.
          </p>
        </div>
      </Frame>
    </div>
  );
}
