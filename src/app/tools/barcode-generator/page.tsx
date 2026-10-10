import { Metadata } from "next";
import { Barcode } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { BarcodeGeneratorWidget } from "@/components/BarcodeGeneratorWidget";

export const metadata: Metadata = {
  title: "Free Barcode Generator - Code 128, EAN-13, UPC Online | ihatetools",
  description: "Generate standard 1D barcodes (Code 128, EAN-13, UPC-A, Code 39) directly in your browser. Download sharp vector SVG or high-resolution PNG labels.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Choose Barcode Format",
    description: "Select Code 128 (general alphanumeric), EAN-13 (global retail), or UPC-A (North American retail).",
  },
  {
    title: "Enter Data or Digits",
    description: "Type your product SKU, serial number, or item code with instant format validation.",
  },
  {
    title: "Download PNG or SVG",
    description: "Export crisp vector SVG for printing or high-DPI PNG directly to your clipboard or computer.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is the difference between Code 128 and UPC/EAN?",
    answer: "Code 128 is an alphanumeric standard commonly used in shipping, inventory, and packaging that accepts letters and numbers. EAN-13 and UPC-A are fixed-length numeric standards used at point-of-sale retail cash registers.",
  },
  {
    question: "Can I print these barcodes on physical product packaging?",
    answer: "Yes! Downloading the vector SVG allows unlimited scaling without blurriness or pixelation, perfect for commercial label printing.",
  },
  {
    question: "Are barcodes scanned by laser scanners?",
    answer: "Yes, the standard bar-and-space widths adhere strictly to GS1 and ISO 15417/15420 specifications, making them fully readable by both optical camera scanners and handheld laser scanners.",
  },
];

const RELATED_TOOLS = [
  { name: "QR Code Generator", href: "/tools/qr-code-generator" },
  { name: "Bulk File Renamer", href: "/tools/bulk-file-renamer" },
  { name: "Invoice Generator", href: "/tools/invoice-generator" },
];

export default function BarcodeGeneratorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Barcode className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Barcode Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Create industrial and retail 1D barcodes in Code 128, EAN-13, and UPC formats. Free and local.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / utility / barcode-generator">
        <BarcodeGeneratorWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
