import { Metadata } from "next";
import { PenTool } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { SignPdfWidget } from "@/components/SignPdfWidget";

export const metadata: Metadata = {
  title: "Sign PDF - Draw or Type Signatures on PDF Online | ihatetools",
  description: "Sign any PDF document directly in your browser. Draw, type, or position your signature securely with zero server uploads.",
  alternates: {
    canonical: "/tools/sign-pdf",
  },
  openGraph: {
    title: "Sign PDF - Draw or Type Signatures on PDF Online | ihatetools",
    description: "Sign any PDF document directly in your browser. Draw, type, or position your signature securely with zero server uploads.",
    url: "/tools/sign-pdf",
  },
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Document",
    description: "Drag and drop the PDF you need to sign into the browser window.",
  },
  {
    title: "Create Signature",
    description: "Draw your signature naturally using a mouse or touchpad, or type your name in elegant handwriting font.",
  },
  {
    title: "Position & Download",
    description: "Drag your signature to the exact page and spot needed, adjust its scale, and download your signed PDF.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my signature or document sent to a server?",
    answer: "No. Everything runs 100% on your device using WebAssembly and pdf-lib. Your signatures and documents never leave your browser.",
  },
  {
    question: "Can I sign multi-page documents?",
    answer: "Yes! Use the page navigator to flip to any page in your PDF and position your signature anywhere.",
  },
  {
    question: "Is this a legally binding signature?",
    answer: "Electronic signatures placed on documents are recognized in many jurisdictions under ESIGN and eIDAS acts for standard commercial agreements, though specific regulatory requirements may vary by industry.",
  },
];

const RELATED_TOOLS = [
  { name: "Fill PDF Form", href: "/tools/fill-pdf-form" },
  { name: "Redact PDF", href: "/tools/redact-pdf" },
  { name: "Merge PDF", href: "/tools/merge-pdf" },
];

export default function SignPdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <PenTool className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Sign PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Add your digital or hand-drawn signature to any PDF document in seconds. Completely private and offline.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / pdf / sign">
        <SignPdfWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
