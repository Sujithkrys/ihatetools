import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { SignPdfWidget } from "@/components/SignPdfWidget";

export const metadata: Metadata = {
  title: "Sign PDF - Draw or Type Signatures on PDF Online | ihatetools",
  description: "Sign any PDF document directly in your browser. Draw, type, or position your signature securely with zero server uploads.",
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Sign PDF
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
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
