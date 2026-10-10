import { Metadata } from "next";
import { Link2 } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { UrlEncoderDecoderWidget } from "@/components/UrlEncoderDecoderWidget";

export const metadata: Metadata = {
  title: "Online URL Encoder & Decoder - Percent-Encoding & Query Parser | ihatetools",
  description: "Encode or decode URLs, URI components, and query parameters instantly. Inspect query string parameters in a clean table with one-click copy. 100% client-side.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Choose Mode",
    description: "Switch between Encode and Decode depending on whether you are escaping special characters or decoding percent-sequences.",
  },
  {
    title: "Configure Options",
    description: "Select standard URI component encoding, full URI encoding, or strict RFC 3986 formatting.",
  },
  {
    title: "Inspect & Copy",
    description: "View parsed query parameters automatically broken down in a structured table, and copy the converted result with a click.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is the difference between encodeURI and encodeURIComponent?",
    answer: "encodeURI is meant for complete URLs and preserves protocol, host, and path delimiters (: / ? # & =). encodeURIComponent encodes every special character, making it safe to use as a query string parameter value.",
  },
  {
    question: "Why are spaces sometimes encoded as '+' instead of '%20'?",
    answer: "In application/x-www-form-urlencoded query strings (often used in HTML forms and URLs), spaces are traditionally replaced with '+' symbols, whereas standard RFC percent-encoding uses '%20'. Our tool allows decoding both formats seamlessly.",
  },
  {
    question: "Does this tool send my URLs over the internet?",
    answer: "No. All URL parsing, encoding, and decoding occurs strictly inside your browser using standard JavaScript URI functions.",
  },
];

const RELATED_TOOLS = [
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "UUID Generator", href: "/tools/uuid-generator" },
  { name: "Markdown Previewer", href: "/tools/markdown-previewer" },
];

export default function UrlEncoderDecoderPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Link2 className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          URL Encoder / Decoder
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Encode and decode URLs, query strings, and URI components with parameter breakdown.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / developer / url-encoder-decoder">
        <UrlEncoderDecoderWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
