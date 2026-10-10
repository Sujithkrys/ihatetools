import { Metadata } from "next";
import { Paintbrush } from "lucide-react";
import { GrayscaleImageWidget } from "@/components/GrayscaleImageWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Grayscale Image Online Free | iHateTools",
  description: "Convert colored photos to black and white or adjust grayscale intensity securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload a Photo",
    description: "Choose a JPG, PNG, or WebP image. It loads directly in your browser, nothing touches a server.",
  },
  {
    title: "Adjust the Intensity Slider",
    description: "Drag the slider to control how much color is removed, from a subtle muted tone to a fully desaturated black and white look.",
  },
  {
    title: "Download the Converted Image",
    description: "The client-side filter engine applies the change instantly, then you save the finished image to your device.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Can I control how strong the grayscale effect is?",
    answer: "Yes. The intensity slider lets you blend between the original color image and a fully desaturated version, rather than only offering an all-or-nothing conversion.",
  },
  {
    question: "Is my photo uploaded anywhere?",
    answer: "No. The grayscale conversion runs entirely on your device using canvas-based filtering, so your files stay completely private.",
  },
  {
    question: "Does converting to grayscale reduce image quality?",
    answer: "No. Only the color channels are adjusted; the resolution and detail of your original image are preserved in the output.",
  },
];

const RELATED_TOOLS = [
  { name: "Flip Image", href: "/tools/flip-image" },
  { name: "Rotate Image", href: "/tools/rotate-image" },
  { name: "Image Compressor", href: "/tools/compress-image" },
];

export default function GrayscaleImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Paintbrush className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Grayscale Image Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Instantly convert your images to black and white or adjust color intensity.
        </p>
      </section>

      <GrayscaleImageWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
