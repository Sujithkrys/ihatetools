import { Metadata } from "next";
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Resume & Job Match Checker
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
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
