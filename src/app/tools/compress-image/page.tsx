import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { CompressImageWidget } from "@/components/CompressImageWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Image Compressor - Compress JPG, PNG, WEBP | ihatetools",
  description: "Reduce image file size instantly in your browser. 100% free, private, client-side optimization.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload images",
    description: "Drop your JPG, PNG, or WEBP images into the upload area. They never leave your device.",
  },
  {
    title: "Adjust quality",
    description: "Use the slider to find the perfect balance between visual quality and file size.",
  },
  {
    title: "Download",
    description: "Download the compressed images individually or as a single ZIP archive.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Why convert PNG to WEBP?",
    answer: "PNG is a lossless format, meaning compressing it won't reduce its size much without changing dimensions. WEBP supports both transparency and lossy compression, resulting in massive file size savings for the web.",
  },
  {
    question: "Is this tool completely private?",
    answer: "Yes! All image processing happens locally in your web browser. No data is sent to our servers.",
  },
];

const RELATED_TOOLS = [
  { name: "Image Resizer", href: "/tools/resize-image" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
];

export default function CompressImagePage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Image Compressor
        </h1>
        <p className="text-textSecondary text-lg">
          Shrink image file size without losing quality. 100% secure and local.
        </p>
      </section>

      <ToolWidgetShell>
        <CompressImageWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
