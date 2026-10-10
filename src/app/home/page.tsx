import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  LayoutGrid as StackIcon,
  Layers,
  Image as ImageIcon,
  Code2,
  Volume2,
} from "lucide-react";
import { Frame } from "@/components/Frame";
import { SelectedText } from "@/components/SelectedText";
import { FAQAccordion } from "@/components/FAQAccordion";
import { TOOLS } from "@/lib/tools-data";
import { getSortedPostsData } from "@/lib/blog";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

const CATEGORY_BADGE: Record<string, string> = {
  "PDF Tools": "badge-pdf",
  "Image Tools": "badge-img",
  "Text Tools": "badge-txt",
  "Audio Tools": "badge-aud",
  "Utility Tools": "badge-util",
};

export const metadata: Metadata = {
  title: "ihatetools - Free PDF, Image, Audio & Text Tools, No Sign-Up",
  description: "60+ free online tools for PDFs, images, audio, and text. Merge PDFs, compress images, convert formats, and more, all processed locally in your browser. No sign-up, no watermark, no uploads.",
};

const POPULAR_TOOL_IDS = [
  "merge-pdf",
  "compress-pdf",
  "compress-image",
  "convert-image",
  "remove-background",
  "qr-code-generator",
  "password-generator",
  "json-formatter",
  "word-counter",
  "heic-to-jpg",
  "resume-ats-checker",
  "audio-trimmer",
];

const HOME_FAQ_ITEMS = [
  {
    question: "Is ihatetools actually free?",
    answer: "Yes, every tool is free with no usage limits, no premium tier, and no credit card required. There is nothing to upgrade to.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. There is no sign-up, no login, and no email required for any tool on the site.",
  },
  {
    question: "Is my data private when I use these tools?",
    answer: "Yes. Every tool runs entirely client-side in your browser using JavaScript and WebAssembly. Your files are never uploaded to a server, so nothing about your documents, images, or audio ever leaves your device.",
  },
  {
    question: "What kinds of tools does ihatetools offer?",
    answer: "Over 60 tools across five categories: PDF tools (merge, split, compress, sign, redact), image tools (compress, resize, convert, remove background), audio tools (trim, convert, compress), text and developer tools (JSON formatting, diff checking, word counts), and everyday utilities (password generators, QR codes, hashing).",
  },
  {
    question: "Will my files have a watermark on them?",
    answer: "No. Output files are clean with no watermark, no attribution footer, and no branding added anywhere.",
  },
];

export default function Home() {
  const allPdfTools = TOOLS.filter(t => t.category === "PDF Tools");
  const allImageTools = TOOLS.filter(t => t.category === "Image Tools");
  const allTextTools = TOOLS.filter(t => t.category === "Text Tools");
  const allAudioAndUtilityTools = TOOLS.filter(
    t => t.category === "Audio Tools" || t.category === "Utility Tools"
  );
  const popularTools = POPULAR_TOOL_IDS
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const recentPosts = getSortedPostsData().slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ihatetools",
    url: SITE_URL,
    description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[60px] pb-[80px]">

      {/* ======== HERO ======== */}
      <Frame showBorder={false}>
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[160px] -right-[120px] w-[600px] h-[600px] rounded-full opacity-[0.14] dark:opacity-[0.18] blur-[100px]"
            style={{ background: "radial-gradient(closest-side, var(--primary, #0D99FF), transparent)" }}
          />
          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-[40px] items-center py-[20px]">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-[10px] mb-[20px]">
                <span className="inline-flex items-center gap-[6px] text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[11px] py-[5px] rounded-full">
                  No sign-up
                </span>
                <span className="inline-flex items-center gap-[6px] text-[12px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[11px] py-[5px] rounded-full">
                  No watermark
                </span>
              </div>
              <h1 className="disp disp-lg text-[clamp(36px,4.6vw,56px)] lg:max-w-[12ch] text-ink leading-[1.05]">
                Tools that <span className="bg-yellow/90 text-[#111212] px-[0.1em] rounded-[0.15em]">don&apos;t</span> waste your time.
              </h1>
              <p className="disp text-[clamp(16px,1.6vw,19px)] font-normal lg:max-w-[38ch] mx-auto lg:mx-0 mt-[18px] text-ink/65">
                Merge, split, compress, and convert, all of it running locally in your browser.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-[12px] mt-[28px]">
                <Link
                  href="/"
                  className="cta browse inline-flex items-center gap-[8px] bg-ink text-paper px-[22px] py-[12px] rounded-[10px] font-medium text-[14.5px] tracking-[-0.02em] cursor-pointer shadow-soft dark:shadow-soft-dark hover:-translate-y-[2px] hover:shadow-soft-hover transition-all"
                >
                  Browse all tools →
                </Link>
                <Link
                  href="/tools/resume-ats-checker"
                  className="inline-flex items-center gap-[8px] border border-ink/12 dark:border-white/15 text-ink px-[22px] py-[12px] rounded-[10px] font-medium text-[14.5px] tracking-[-0.02em] cursor-pointer hover:bg-ink/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                >
                  Try a tool
                </Link>
              </div>
              <p className="max-w-[460px] mx-auto lg:mx-0 mt-[24px] text-[13px] leading-[1.7] text-grey">
                No uploads. No subscriptions.{" "}
                <Link href="/" className="text-ink underline underline-offset-2 hover:text-sel transition-colors">Browse every tool</Link>
                {" "}or read the{" "}
                <Link href="/blog" className="text-ink underline underline-offset-2 hover:text-sel transition-colors">guides</Link>.
              </p>
            </div>

            {/* Product shot */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-[16px] border border-ink/10 dark:border-white/10 bg-paper dark:bg-bg shadow-soft-hover overflow-hidden rotate-[1.2deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-[6px] px-[14px] py-[10px] border-b border-ink/8 dark:border-white/10 bg-ink/[0.015] dark:bg-white/[0.02]">
                  <span className="w-[9px] h-[9px] rounded-full bg-ink/15 dark:bg-white/20" />
                  <span className="w-[9px] h-[9px] rounded-full bg-ink/15 dark:bg-white/20" />
                  <span className="w-[9px] h-[9px] rounded-full bg-ink/15 dark:bg-white/20" />
                  <span className="ml-[8px] text-[11px] font-mono text-grey">ihatetools.in/tools/resume-ats-checker</span>
                </div>
                <Image
                  src="/images/hero-ats-card.png"
                  alt="ihatetools resume and job match checker showing a 67% keyword match score"
                  width={1388}
                  height={812}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute -bottom-[14px] -left-[14px] -z-10 w-full h-full rounded-[16px] bg-sel/10 dark:bg-sel/15" />
            </div>
          </div>
        </div>
      </Frame>

      {/* ======== STATS STRIP ======== */}
      <Frame showBorder={false}>
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-[920px] mx-auto divide-x divide-y md:divide-y-0 divide-ink/8 dark:divide-white/10 border border-ink/8 dark:border-white/10 rounded-[16px] overflow-hidden">
          {[
            { value: `${TOOLS.length}+`, label: "Free tools" },
            { value: "100%", label: "Client-side" },
            { value: "$0", label: "Forever" },
            { value: "0", label: "Sign-ups required" },
          ].map((stat) => (
            <div key={stat.label} className="p-[20px] text-center bg-paper dark:bg-bg">
              <div className="stat-num text-[28px] text-ink">{stat.value}</div>
              <div className="text-[11.5px] text-grey mt-[4px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </Frame>

      {/* ======== WHY IT'S DIFFERENT ======== */}
      <Frame label="Why it's different" labelColor="pink">
        <div className="grid md:grid-cols-3 gap-[18px] max-w-[920px] mx-auto">
          <div className="blk p-[24px]">
            <div className="w-10 h-10 rounded-full bg-ink/5 dark:bg-white/5 flex items-center justify-center mb-[14px]">
              <ShieldCheck className="w-[18px] h-[18px] text-ink/70" strokeWidth={1.75} />
            </div>
            <h3 className="disp text-[18px] mb-[8px]">Your files never leave</h3>
            <SelectedText className="mt-[6px]">Everything runs in your browser. No server, no upload, no copy of your document sitting somewhere.</SelectedText>
          </div>
          <div className="blk p-[24px]">
            <div className="w-10 h-10 rounded-full bg-ink/5 dark:bg-white/5 flex items-center justify-center mb-[14px]">
              <BadgeCheck className="w-[18px] h-[18px] text-ink/70" strokeWidth={1.75} />
            </div>
            <h3 className="disp text-[18px] mb-[8px]">Free, with no asterisk</h3>
            <SelectedText className="mt-[6px]">No sign-up wall, no watermark on the output, no &quot;upgrade to download&quot; at the last step.</SelectedText>
          </div>
          <div className="blk p-[24px]">
            <div className="w-10 h-10 rounded-full bg-ink/5 dark:bg-white/5 flex items-center justify-center mb-[14px]">
              <StackIcon className="w-[18px] h-[18px] text-ink/70" strokeWidth={1.75} />
            </div>
            <h3 className="disp text-[18px] mb-[8px]">One place for all of it</h3>
            <SelectedText className="mt-[6px]">PDF, image, audio, utility, and text tools together, so you&apos;re not hunting for a new site every time.</SelectedText>
          </div>
        </div>
      </Frame>

      {/* ======== CATEGORIES OVERVIEW ======== */}
      <Frame label="Categories" labelColor="cyan">
        <div className="blocks grid md:grid-cols-2 gap-[18px] max-w-[920px] mx-auto">
          <Link href="/tools/pdf" className="blk block p-[24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center gap-3 mb-[12px]">
              <div className={`badge ${CATEGORY_BADGE["PDF Tools"]} !mb-0 !w-10 !h-10`}>
                <Layers size={18} strokeWidth={1.75} />
              </div>
              <h3 className="disp text-[18px] text-ink flex-1">PDF Tools</h3>
              <span className="text-[11px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allPdfTools.length}</span>
            </div>
            <p className="text-[14px] leading-[1.55] text-grey">
              Merge, split, compress, sign, redact, fill forms, and more, everything for working with PDF files.
            </p>
          </Link>

          <Link href="/tools/image" className="blk block p-[24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center gap-3 mb-[12px]">
              <div className={`badge ${CATEGORY_BADGE["Image Tools"]} !mb-0 !w-10 !h-10`}>
                <ImageIcon size={18} strokeWidth={1.75} />
              </div>
              <h3 className="disp text-[18px] text-ink flex-1">Image Tools</h3>
              <span className="text-[11px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allImageTools.length}</span>
            </div>
            <p className="text-[14px] leading-[1.55] text-grey">
              Compress, resize, crop, convert formats, and touch up your photos in the browser.
            </p>
          </Link>

          <Link href="/tools/text" className="blk block p-[24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center gap-3 mb-[12px]">
              <div className={`badge ${CATEGORY_BADGE["Text Tools"]} !mb-0 !w-10 !h-10`}>
                <Code2 size={18} strokeWidth={1.75} />
              </div>
              <h3 className="disp text-[18px] text-ink flex-1">Text &amp; Dev Tools</h3>
              <span className="text-[11px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allTextTools.length}</span>
            </div>
            <p className="text-[14px] leading-[1.55] text-grey">
              JSON formatting, word counts, case conversion, and diff checking, quick text utilities.
            </p>
          </Link>

          <Link href="/tools/audio" className="blk block p-[24px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group">
            <div className="flex items-center gap-3 mb-[12px]">
              <div className={`badge ${CATEGORY_BADGE["Audio Tools"]} !mb-0 !w-10 !h-10`}>
                <Volume2 size={18} strokeWidth={1.75} />
              </div>
              <h3 className="disp text-[18px] text-ink flex-1">Audio &amp; Utility</h3>
              <span className="text-[11px] font-medium text-grey bg-ink/5 dark:bg-white/5 px-[9px] py-[3px] rounded-full">{allAudioAndUtilityTools.length}</span>
            </div>
            <p className="text-[14px] leading-[1.55] text-grey">
              Trim and convert audio, generate invoices, passwords, barcodes, and other everyday tools.
            </p>
          </Link>
        </div>
      </Frame>

      {/* ======== POPULAR TOOLS ======== */}
      <Frame label="Popular tools" labelColor="yellow">
        <div className="flex items-baseline justify-between max-w-[920px] mx-auto mb-[18px]">
          <h2 className="disp text-[22px] text-ink">Start with one of these</h2>
          <Link href="/" className="text-[13px] font-medium text-grey hover:text-ink transition-colors inline-flex items-center gap-1">
            All tools <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] max-w-[920px] mx-auto">
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="blk flex items-start gap-3 p-[16px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group"
              >
                <div className={`badge ${CATEGORY_BADGE[tool.category]} !mb-0 !w-9 !h-9 shrink-0`}>
                  {Icon && <Icon size={16} strokeWidth={1.75} />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-semibold text-ink mb-[2px] leading-tight">{tool.name}</h3>
                  <p className="text-[12.5px] leading-[1.4] text-grey line-clamp-2">{tool.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Frame>

      {/* ======== FROM THE BLOG ======== */}
      {recentPosts.length > 0 && (
        <Frame label="From the blog" labelColor="violet">
          <div className="flex items-baseline justify-between max-w-[920px] mx-auto mb-[18px]">
            <h2 className="disp text-[22px] text-ink">Guides &amp; how-tos</h2>
            <Link href="/blog" className="text-[13px] font-medium text-grey hover:text-ink transition-colors inline-flex items-center gap-1">
              View all posts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-[14px] max-w-[920px] mx-auto">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blk block p-[20px_22px] hover:-translate-y-[2px] transition-transform cursor-pointer no-underline group"
              >
                <time className="text-[11px] font-mono text-grey/80">{post.date}</time>
                <h3 className="disp text-[16px] text-ink mt-[4px] mb-[6px] leading-[1.3]">{post.title}</h3>
                <p className="text-[13px] leading-[1.55] text-grey line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </Frame>
      )}

      {/* ======== FAQ ======== */}
      <FAQAccordion items={HOME_FAQ_ITEMS} />
    </div>
    <Footer />
    </>
  );
}
