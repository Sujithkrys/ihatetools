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
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Image Resizer
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Resize images to specific dimensions easily. 100% secure and local.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / image / resize">
        <ResizeImageWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
