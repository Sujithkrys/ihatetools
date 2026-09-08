import { Metadata } from "next";
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Resume Builder
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
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
