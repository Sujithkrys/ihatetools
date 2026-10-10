import { Metadata } from "next";
import { CaseUpper } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { CaseConverterWidget } from "@/components/CaseConverterWidget";

export const metadata: Metadata = {
  title: "Case Converter Online Free | iHateTools",
  description: "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Paste Your Text",
    description: "Type or paste the text or identifier you want to convert.",
  },
  {
    title: "Pick a Case Style",
    description: "Choose lowercase, UPPERCASE, Title Case, camelCase, snake_case, or kebab-case.",
  },
  {
    title: "Copy the Result",
    description: "The conversion happens instantly in your browser, then you copy the converted text wherever you need it.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my text sent to a server?",
    answer: "No. All case conversion happens locally in your browser, so you can safely convert sensitive internal identifiers or database keys without them leaving your device.",
  },
  {
    question: "What case styles are supported?",
    answer: "You can convert between lowercase, UPPERCASE, Title Case, camelCase, snake_case, and kebab-case.",
  },
  {
    question: "Is there a limit to how much text I can convert?",
    answer: "No hard limit is enforced. The tool processes text directly in the browser, so very large blocks of text are handled smoothly on most devices.",
  },
  {
    question: "Why would I need camelCase or snake_case conversion?",
    answer: "Developers often need to quickly rename variables, database columns, or file names between coding conventions, and this saves manually retyping each one.",
  },
];

const RELATED_TOOLS = [
  { name: "Word & Character Counter", href: "/tools/word-counter" },
  { name: "Text Diff Checker", href: "/tools/text-diff" },
  { name: "JSON Formatter", href: "/tools/json-formatter" },
];

export default function CaseConverterPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <CaseUpper className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Case Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Convert text instantly between UPPERCASE, lowercase, Title Case, and code cases.
        </p>
      </section>

      <CaseConverterWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
