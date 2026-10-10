import { Metadata } from "next";
import { FlipHorizontal } from "lucide-react";
import { FlipImageWidget } from "@/components/FlipImageWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Flip Image Online Free | iHateTools",
  description: "Mirror and flip your images horizontally or vertically securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Image",
    description: "Drop in a JPG, PNG, or WebP file. It loads directly into your browser's memory, nothing is uploaded anywhere.",
  },
  {
    title: "Choose a Flip Direction",
    description: "Pick horizontal to mirror left-to-right, or vertical to flip upside-down.",
  },
  {
    title: "Download the Result",
    description: "The canvas renders the mirrored image instantly, then you save it straight to your device.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does flipping an image reduce its quality?",
    answer: "No. Flipping only repositions pixels; it does not resample or recompress the image, so the output keeps the original resolution and quality.",
  },
  {
    question: "Is my image uploaded to a server?",
    answer: "No. The flip is performed entirely with local canvas rendering in your browser. There are zero server uploads and no wait times.",
  },
  {
    question: "Can I flip an image both horizontally and vertically?",
    answer: "Yes, you can apply a horizontal flip and then a vertical flip to the same image for a full 180 degree mirror effect.",
  },
];

const RELATED_TOOLS = [
  { name: "Rotate Image", href: "/tools/rotate-image" },
  { name: "Grayscale Image Converter", href: "/tools/grayscale-image" },
  { name: "Image Crop", href: "/tools/crop-image" },
];

export default function FlipImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FlipHorizontal className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Flip Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Mirror your photos horizontally or vertically in one click.
        </p>
      </section>

      <FlipImageWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
