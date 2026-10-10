import { Metadata } from "next";
import { Hash } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { HashGeneratorWidget } from "@/components/HashGeneratorWidget";

export const metadata: Metadata = {
  title: "Online Hash Generator - MD5, SHA-1, SHA-256, SHA-512 | ihatetools",
  description: "Calculate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes for text or uploaded files. Fast, private, and client-side via Web Crypto.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Enter Text or Upload File",
    description: "Type raw text into the input box or drop any file directly into the dropzone.",
  },
  {
    title: "Simultaneous Hash Computation",
    description: "Web Crypto and SparkMD5 compute MD5, SHA-1, SHA-256, and SHA-512 in parallel on your device.",
  },
  {
    title: "Compare & Copy",
    description: "Check generated checksums against a known hash to verify file integrity, and copy results with one click.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my file or text uploaded to any server?",
    answer: "No. The hashing process runs entirely on your device inside your browser using the HTML5 File API and browser Web Crypto. No data is transmitted.",
  },
  {
    question: "What is the difference between MD5 and SHA-256?",
    answer: "MD5 produces a 128-bit hash and is fast for non-cryptographic checksum verification. SHA-256 produces a 256-bit hash with collision resistance suited for security and cryptographic verification.",
  },
  {
    question: "Can large files be hashed in the browser?",
    answer: "Yes, modern browsers can hash multi-megabyte files smoothly. For huge files (hundreds of megabytes), memory depends on available browser RAM.",
  },
];

const RELATED_TOOLS = [
  { name: "UUID Generator", href: "/tools/uuid-generator" },
  { name: "Duplicate File Finder", href: "/tools/duplicate-file-finder" },
  { name: "URL Encoder / Decoder", href: "/tools/url-encoder-decoder" },
];

export default function HashGeneratorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Hash className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Hash Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes for text and files securely in your browser.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / developer / hash-generator">
        <HashGeneratorWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
