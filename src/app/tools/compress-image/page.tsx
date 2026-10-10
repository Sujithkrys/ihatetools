import { Metadata } from "next";
import { Minimize2 } from "lucide-react";
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
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Minimize2 className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Image Compressor
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Shrink image file size without losing quality. 100% secure and local.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / image / compress">
        <CompressImageWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
