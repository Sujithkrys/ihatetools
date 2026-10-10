import { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { ResumeBuilderWidget } from "@/components/ResumeBuilderWidget";

export const metadata: Metadata = {
  title: "Free Resume Builder - Professional PDF CV Creator | ihatetools",
  description: "Build an ATS-friendly, clean single-page PDF resume directly in your browser. Simple, elegant, and 100% private.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Fill Contact & Summary",
    description: "Enter your contact details, target job title, and a compelling elevator summary.",
  },
  {
    title: "Add Experience & Education",
    description: "Outline your roles, bulleted accomplishments, degrees, and relevant tech skills.",
  },
  {
    title: "Download Vector PDF",
    description: "Preview your formatted CV in real-time and export a crisp PDF ready for applications.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this resume ATS friendly?",
    answer: "Yes. The output uses standard vector typography, clear semantic section headers, and linear layouts that applicant tracking systems parse easily without getting confused by multi-column floats or graphics.",
  },
  {
    question: "Can I edit after downloading?",
    answer: "You can keep your browser tab open or quickly re-enter info to make changes and generate a new copy immediately.",
  },
  {
    question: "Does ihatetools track my employment history?",
    answer: "Never. Your personal resume details are kept exclusively within your local browser runtime.",
  },
];

const RELATED_TOOLS = [
  { name: "Invoice Generator", href: "/tools/invoice-generator" },
  { name: "Sign PDF", href: "/tools/sign-pdf" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function ResumeBuilderPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Briefcase className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Resume Builder
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate a polished, recruiter-approved resume PDF in minutes. Zero paywalls, zero subscriptions.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / pdf / resume-builder">
        <ResumeBuilderWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
