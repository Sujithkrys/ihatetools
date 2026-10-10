import { Metadata } from "next";
import { Maximize } from "lucide-react";
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
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Maximize className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Image Resizer
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
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
