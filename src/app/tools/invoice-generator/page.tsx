import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { InvoiceGeneratorWidget } from "@/components/InvoiceGeneratorWidget";

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create Clean PDF Invoices | ihatetools",
  description: "Generate professional, beautifully formatted PDF invoices directly in your browser. Add line items, taxes, currencies, and client details with zero watermark.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Enter Business & Client Info",
    description: "Fill in your company details, logo text, invoice number, and client billing address.",
  },
  {
    title: "Add Items & Calculate Tax",
    description: "Itemize deliverables with quantities and rates. Totals, subtotals, and taxes calculate automatically.",
  },
  {
    title: "Export Clean PDF",
    description: "Generate an A4 vector PDF invoice formatted for print and email invoicing in one click.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this invoice generator free to use?",
    answer: "Yes, 100% free with no hidden subscriptions, limits, or watermarks.",
  },
  {
    question: "Can I use foreign currencies?",
    answer: "Yes, you can choose between USD ($), EUR (€), GBP (£), INR (₹), CAD, AUD, and more.",
  },
  {
    question: "Do you save my client details?",
    answer: "Never. All invoice data is rendered client-side on your computer and disappears when you close or reload the page.",
  },
];

const RELATED_TOOLS = [
  { name: "Resume Builder", href: "/tools/resume-builder" },
  { name: "Sign PDF", href: "/tools/sign-pdf" },
  { name: "PDF Compare", href: "/tools/pdf-compare" },
];

export default function InvoiceGeneratorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Invoice Generator
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
          Craft sleek, professional PDF invoices for clients and accounting without signups or tracking.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / pdf / invoice-generator">
        <InvoiceGeneratorWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
