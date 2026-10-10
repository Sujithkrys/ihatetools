import { Metadata } from "next";
import { Braces } from "lucide-react";
import { JsonFormatterWidget } from "@/components/JsonFormatterWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online Free | iHateTools",
  description: "Format, validate, and minify JSON data instantly in your browser. Clean up messy JSON code.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Paste Your JSON",
    description: "Drop in raw or minified JSON, including messy API responses or config files.",
  },
  {
    title: "Format, Validate, or Minify",
    description: "The tool parses the JSON with the browser's native JSON engine, flags any syntax errors, and lets you choose an indent level or collapse it to a single line.",
  },
  {
    title: "Copy the Result",
    description: "Copy the cleaned-up, properly indented JSON straight to your clipboard.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my JSON data sent to a server?",
    answer: "No. Our JSON Formatter works entirely in your browser using the native JSON.parse and JSON.stringify engine. Your data never leaves your computer, which matters when you're dealing with sensitive API payloads.",
  },
  {
    question: "What happens if my JSON has a syntax error?",
    answer: "The formatter will tell you that the input is invalid so you can locate and fix the problem, rather than silently producing broken output.",
  },
  {
    question: "Can I control the indentation?",
    answer: "Yes, you can choose your preferred indent width, or minify the JSON down to a single compact line with no extra whitespace.",
  },
];

const RELATED_TOOLS = [
  { name: "Text Diff Checker", href: "/tools/text-diff" },
  { name: "URL Encoder / Decoder", href: "/tools/url-encoder-decoder" },
  { name: "Case Converter", href: "/tools/case-converter" },
];

export default function JsonFormatterPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Braces className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          JSON Formatter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Format, validate, and minify JSON instantly in your browser.
        </p>
      </section>

      <JsonFormatterWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
