import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { RedactPdfWidget } from "@/components/RedactPdfWidget";

export const metadata: Metadata = {
  title: "Redact PDF - Permanently Remove Sensitive Text from PDF | ihatetools",
  description: "Permanently blackout and erase sensitive data, SSNs, financial details, and text from PDF documents. Zero text leakage guarantee.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Document",
    description: "Select the PDF containing confidential information you need to redact.",
  },
  {
    title: "Draw Redaction Zones",
    description: "Click and drag to place solid black redaction boxes over sensitive words, figures, or images.",
  },
  {
    title: "Sanitize & Download",
    description: "The affected pages are rasterized and reconstructed so underlying text is physically eradicated before exporting.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Can someone highlight or copy text from behind the black boxes?",
    answer: "No! Unlike superficial editors that only draw a dark rectangle over selectable text, ihatetools genuinely sanitizes the page by flattening the redacted region into pure pixels. There is literally no underlying text or vector stream remaining to extract.",
  },
  {
    question: "Does it preserve quality on non-redacted pages?",
    answer: "Yes. Pages without any redactions maintain their full vector sharpness and original structure.",
  },
  {
    question: "Are files uploaded to a remote server for processing?",
    answer: "No. Redaction and rasterization happen directly inside your browser using client-side canvas rendering and pdf-lib.",
  },
];

const RELATED_TOOLS = [
  { name: "Sign PDF", href: "/tools/sign-pdf" },
  { name: "PDF Compare", href: "/tools/pdf-compare" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function RedactPdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Redact PDF
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
          Eradicate confidential numbers, identities, and text from PDF pages with true pixel-level sanitization.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / pdf / redact">
        <RedactPdfWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
