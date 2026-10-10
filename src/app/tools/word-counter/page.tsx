import { Metadata } from "next";
import { FileText } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { WordCounterWidget } from "@/components/WordCounterWidget";

export const metadata: Metadata = {
  title: "Word & Character Counter Online Free | iHateTools",
  description: "Live count of words, characters, characters without spaces, paragraphs, and reading time.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Type or Paste Your Text",
    description: "Enter your draft, essay, or caption directly into the text editor.",
  },
  {
    title: "Watch the Live Stats Update",
    description: "Word count, character count, paragraph count, and estimated reading time update instantly as you type.",
  },
  {
    title: "Edit Until You Hit Your Target",
    description: "Trim or expand your text while watching the counters to meet a specific limit, such as a tweet or essay word count.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does this count characters with and without spaces?",
    answer: "Yes, the tool shows both the total character count including spaces and the count with spaces excluded, so you can match whichever limit you are working against.",
  },
  {
    question: "Is my text sent to a server while I type?",
    answer: "No. All statistics are computed locally in your browser in real time, so your text is never transmitted or stored anywhere.",
  },
  {
    question: "How is reading time estimated?",
    answer: "Reading time is calculated from your total word count using an average adult reading speed, giving you a quick estimate for blog posts or scripts.",
  },
  {
    question: "Can I use this for social media character limits?",
    answer: "Yes, it is well suited for checking text against limits like tweets or meta descriptions, since the character count updates live as you edit.",
  },
];

const RELATED_TOOLS = [
  { name: "Text Diff Checker", href: "/tools/text-diff" },
  { name: "Case Converter", href: "/tools/case-converter" },
  { name: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum-generator" },
];

export default function WordCounterPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileText className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Word Counter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Type or paste your text for instant word, character, and paragraph statistics.
        </p>
      </section>

      <WordCounterWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
