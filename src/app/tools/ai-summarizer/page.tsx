import { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { SummarizerWidget } from "@/components/SummarizerWidget";

export const metadata: Metadata = {
  title: "AI Text Summarizer - Free Online Summarizer Tool | ihatetools",
  description: "Summarize long articles, essays, and text instantly with AI. Fast, free, concise bullet points and takeaways with no sign-up required.",
  alternates: {
    canonical: "/tools/ai-summarizer",
  },
  openGraph: {
    title: "AI Text Summarizer - Free Online Summarizer Tool | ihatetools",
    description: "Summarize long articles, essays, and text instantly with AI. Fast, free, concise bullet points and takeaways with no sign-up required.",
    url: "/tools/ai-summarizer",
  },
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Paste or Type Your Text",
    description: "Enter your article, notes, or draft into the editor (up to 3,000 characters).",
  },
  {
    title: "Summarize with Gemini AI",
    description: "Click Summarize. Our Gemini-powered engine distills the core points and main takeaways in seconds.",
  },
  {
    title: "Copy and Use Anywhere",
    description: "Copy your clean summary with one click to use in your notes, messages, or reports.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this AI Summarizer really free?",
    answer: "Yes, it is 100% free with no account creation or credit card required. We provide daily allowances for every user.",
  },
  {
    question: "Is there a daily limit?",
    answer: "Yes. To keep this free tool available to everyone within Google Gemini's free tier quotas, there is a generous daily limit per user as well as a global daily community cap.",
  },
  {
    question: "What is the maximum text length I can summarize?",
    answer: "You can summarize up to 3,000 characters at a time. This keeps response times fast and ensures summaries are concise and focused.",
  },
  {
    question: "Does ihatetools store my text?",
    answer: "No. Your text is processed in memory solely to produce the summary and is never logged, stored, or saved to any database.",
  },
];

const RELATED_TOOLS = [
  { name: "Word Counter", href: "/tools/word-counter" },
  { name: "Text Diff Checker", href: "/tools/text-diff" },
  { name: "Case Converter", href: "/tools/case-converter" },
  { name: "JSON Formatter", href: "/tools/json-formatter" },
];

export default function AiSummarizerPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Sparkles className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text & Dev</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          AI Text Summarizer
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Distill long articles, essays, and notes into key bullet points and clear takeaways using AI.
        </p>
      </section>

      <SummarizerWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
