import { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { ResumeAtsCheckerWidget } from "@/components/ResumeAtsCheckerWidget";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker - Keyword Match & Formatting Scan | ihatetools",
  description: "Check your resume against a job description for keyword gaps and formatting risks, free and 100% in your browser. Nothing is uploaded.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Add Your Resume",
    description: "Paste your resume text or upload a PDF. Text is extracted entirely in your browser.",
  },
  {
    title: "Paste the Job Description",
    description: "Drop in the full job posting so the tool can pull out the terms that actually matter.",
  },
  {
    title: "Review the Report",
    description: "See matched and missing keywords plus formatting risks, with plain explanations for each.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this the same as a real company's ATS?",
    answer: "No. Every employer uses different hiring software (Workday, Greenhouse, iCIMS, and others) with its own private rules, and none of them publish how their ranking actually works. This tool checks well-documented, defensible signals, keyword overlap and basic formatting, it does not simulate any specific vendor's software.",
  },
  {
    question: "Why does it say my PDF has no text?",
    answer: "Some resumes are exported as a flattened image or a scanned document, which means there is no selectable text layer underneath the visuals. Most real ATS software cannot read these at all, so this is one of the most important checks the tool runs. Try our OCR tool to recover the text, then rebuild your resume as a text-based PDF.",
  },
  {
    question: "Should I rely on this alone before applying?",
    answer: "Treat it as one useful signal, not a verdict. Use it to catch obvious keyword gaps and formatting risks, then still have a human read your resume if you can. A high match score here does not guarantee an interview, and a lower one does not mean you should not apply.",
  },
  {
    question: "Is my resume or the job description uploaded anywhere?",
    answer: "No. Both the keyword extraction and the matching run entirely in your browser using plain JavaScript, there is no server call, no AI model, and no account. Closing the tab clears everything.",
  },
];

const RELATED_TOOLS = [
  { name: "Resume Builder", href: "/tools/resume-builder" },
  { name: "Word Counter", href: "/tools/word-counter" },
  { name: "Extract PDF Text", href: "/tools/extract-pdf-text" },
];

export default function ResumeAtsCheckerPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Resume & Job Match Checker
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Check your resume against a job description for keyword gaps and formatting risks, free and entirely in your browser.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / pdf / resume-ats-checker">
        <ResumeAtsCheckerWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
