import { Metadata } from "next";
import { AlignLeft } from "lucide-react";
import { LoremIpsumGeneratorWidget } from "@/components/LoremIpsumGeneratorWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator Online Free | iHateTools",
  description: "Instantly generate random Lorem Ipsum placeholder text by words or paragraphs for your mockups and designs.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Choose Words or Paragraphs",
    description: "Pick whether you want the output measured in individual words or full paragraphs.",
  },
  {
    title: "Set the Amount",
    description: "Enter how many words or paragraphs you need, from a short snippet up to thousands of words.",
  },
  {
    title: "Copy Your Placeholder Text",
    description: "The generator builds randomized Latin-style text instantly, ready to copy to your clipboard with one click.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is Lorem Ipsum used for?",
    answer: "Lorem Ipsum is standard randomized Latin placeholder text used by designers and developers to fill UI mockups and web page layouts before real content is ready.",
  },
  {
    question: "Can I generate an exact word count?",
    answer: "Yes, switching to word mode lets you request a specific number of words, up to 5,000, instead of being limited to whole paragraphs.",
  },
  {
    question: "Does this tool require an internet connection to generate text?",
    answer: "Once the page loads, the text is generated directly in your browser, so there's no server request involved in producing the placeholder content.",
  },
];

const RELATED_TOOLS = [
  { name: "Word & Character Counter", href: "/tools/word-counter" },
  { name: "Case Converter", href: "/tools/case-converter" },
  { name: "Markdown Previewer", href: "/tools/markdown-previewer" },
];

export default function LoremIpsumGeneratorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <AlignLeft className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Lorem Ipsum Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate random placeholder text instantly for your UI mockups and web designs.
        </p>
      </section>

      <LoremIpsumGeneratorWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
