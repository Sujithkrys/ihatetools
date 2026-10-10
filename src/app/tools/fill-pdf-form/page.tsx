import { Metadata } from "next";
import { CheckSquare } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { FillPdfFormWidget } from "@/components/FillPdfFormWidget";

export const metadata: Metadata = {
  title: "Fill PDF Form - Interactive AcroForm Filler Online | ihatetools",
  description: "Detect and fill interactive PDF form fields directly in your browser. Edit text inputs, toggle checkboxes, pick dropdowns, and download.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Fillable PDF",
    description: "Drop your interactive AcroForm PDF. The tool scans for form fields automatically.",
  },
  {
    title: "Fill in Details",
    description: "Enter your information into text fields, check boxes, or pick items from dropdown lists.",
  },
  {
    title: "Save & Flatten",
    description: "Optionally flatten the fields to make edits permanent, then export your filled PDF instantly.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Why does it say 'No fillable fields detected'?",
    answer: "Many government and tax forms are scanned paper documents, flattened images, or use proprietary Adobe XFA formats rather than standard interactive AcroForm fields. If a PDF lacks real digital field structures, it cannot be programmatically filled.",
  },
  {
    question: "What is 'flattening' a form?",
    answer: "Flattening integrates your input directly into the page rendering, turning interactive fields into static text so recipients cannot accidentally modify your answers.",
  },
  {
    question: "Are my form responses stored anywhere?",
    answer: "No. All field values are processed entirely in memory inside your browser. No data is ever transmitted or stored on remote servers.",
  },
];

const RELATED_TOOLS = [
  { name: "Sign PDF", href: "/tools/sign-pdf" },
  { name: "Invoice Generator", href: "/tools/invoice-generator" },
  { name: "Redact PDF", href: "/tools/redact-pdf" },
];

export default function FillPdfFormPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <CheckSquare className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Fill PDF Form
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Complete interactive PDF forms quickly and securely without installing Adobe Acrobat or uploading sensitive personal data.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / pdf / fill-form">
        <FillPdfFormWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
