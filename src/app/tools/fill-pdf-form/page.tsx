import { Metadata } from "next";
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Fill PDF Form
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
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
