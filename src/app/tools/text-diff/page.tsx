import { Metadata } from "next";
import { Diff } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { TextDiffCheckerWidget } from "@/components/TextDiffCheckerWidget";

export const metadata: Metadata = {
  title: "Text Diff Checker Online Free | iHateTools",
  description: "Compare two text documents side-by-side to instantly find differences, additions, and deletions.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Paste the Original Text",
    description: "Drop the first version of your text, code, or document into the left panel.",
  },
  {
    title: "Paste the Changed Text",
    description: "Drop the updated version into the right panel for comparison.",
  },
  {
    title: "Review the Color-Coded Diff",
    description: "Instantly see additions, deletions, and unchanged lines highlighted inline between the two versions.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What kind of text can I compare?",
    answer: "Any plain text works well, including code snippets, essays, contracts, or configuration files. The tool highlights line-by-line and word-level differences.",
  },
  {
    question: "Is my text sent to a server for comparison?",
    answer: "No. The comparison algorithm runs entirely in your browser memory, so neither the original nor the changed text is ever sent over the network.",
  },
  {
    question: "How are the differences shown?",
    answer: "Added content is highlighted in one color and removed content in another, with unchanged text left as is, making it easy to spot exactly what changed.",
  },
  {
    question: "Is there a limit to how much text I can paste?",
    answer: "Since everything runs in your browser, very large documents may take slightly longer to render, but there is no fixed character limit.",
  },
];

const RELATED_TOOLS = [
  { name: "Word & Character Counter", href: "/tools/word-counter" },
  { name: "JSON Formatter", href: "/tools/json-formatter" },
  { name: "Case Converter", href: "/tools/case-converter" },
];

export default function TextDiffCheckerPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Diff className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Text Diff Checker
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Compare two text blocks to instantly spot additions and deletions.
        </p>
      </section>

      <TextDiffCheckerWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
