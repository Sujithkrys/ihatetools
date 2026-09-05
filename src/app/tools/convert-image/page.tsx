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
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Convert Image Format
        </h1>
        <p className="text-textSecondary text-lg">
          Convert between JPG, PNG, WEBP, and more. 100% secure and local.
        </p>
      </section>

      <ToolWidgetShell>
        <ConvertImageWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
