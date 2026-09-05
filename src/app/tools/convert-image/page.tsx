import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { ConvertImageWidget } from "@/components/ConvertImageWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Convert Image Format - Change JPG, PNG, WEBP | ihatetools",
  description: "Convert images between formats instantly in your browser. 100% free, private, client-side conversion.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload images",
    description: "Drop your images into the upload area. They never leave your device.",
  },
  {
    title: "Select format",
    description: "Choose your desired target format (JPG, PNG, or WEBP).",
  },
  {
    title: "Download",
    description: "Download the converted images individually or as a single ZIP archive.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What happens to transparent PNGs when converting to JPG?",
    answer: "Since JPG doesn't support transparency, any transparent pixels will automatically be filled with a solid white background to prevent ugly black artifacts.",
  },
  {
    question: "Is this tool completely private?",
    answer: "Yes! All image processing happens locally in your web browser. No data is sent to our servers.",
  },
];

const RELATED_TOOLS = [
  { name: "Image Compressor", href: "/tools/compress-image" },
  { name: "Image Resizer", href: "/tools/resize-image" },
];

export default function ConvertImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Convert Image Format
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Convert between JPG, PNG, WEBP, and more. 100% secure and local.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / image / convert">
        <ConvertImageWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
