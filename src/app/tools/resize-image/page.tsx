import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { ResizeImageWidget } from "@/components/ResizeImageWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Image Resizer - Resize JPG, PNG, WEBP | ihatetools",
  description: "Resize images to exact dimensions instantly in your browser. 100% free, private, client-side resizing.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload images",
    description: "Drop your JPG, PNG, or WEBP images into the upload area. They never leave your device.",
  },
  {
    title: "Set dimensions",
    description: "Type in the new width or height in pixels. Lock the aspect ratio to prevent stretching.",
  },
  {
    title: "Download",
    description: "Download the resized images individually or as a single ZIP archive.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this tool completely private?",
    answer: "Yes! All image processing happens locally in your web browser. No data is sent to our servers.",
  },
];

const RELATED_TOOLS = [
  { name: "Image Compressor", href: "/tools/compress-image" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
];

export default function ResizeImagePage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Image Resizer
        </h1>
        <p className="text-textSecondary text-lg">
          Resize images to specific dimensions easily. 100% secure and local.
        </p>
      </section>

      <ToolWidgetShell>
        <ResizeImageWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
