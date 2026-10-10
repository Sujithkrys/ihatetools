import { Metadata } from "next";
import { EyeOff } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { BlurImageRegionWidget } from "@/components/BlurImageRegionWidget";

export const metadata: Metadata = {
  title: "Blur & Pixelate Image Parts Online Free | iHateTools",
  description: "Easily censor sensitive information like faces, license plates, or documents by blurring or pixelating specific regions of an image.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload an Image",
    description: "Drag and drop or select the image containing the sensitive area you want to hide.",
  },
  {
    title: "Select the Region & Mode",
    description: "Draw a box over the area to censor and choose between a blur or a pixelate effect, adjusting the intensity as needed.",
  },
  {
    title: "Apply & Download",
    description: "The effect is rendered using the HTML5 Canvas directly in your browser, then you download the censored image.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my image uploaded to a server?",
    answer: "No. All blurring and pixelation happens locally using native HTML5 Canvas, so the original image never leaves your device.",
  },
  {
    question: "What's the difference between blur and pixelate?",
    answer: "Blur softens the selected region with a gaussian-style blur, while pixelate breaks it into large visible blocks. Both effectively obscure details like faces, license plates, or text.",
  },
  {
    question: "Can I adjust how strong the effect is?",
    answer: "Yes. An intensity slider controls the blur radius or pixelate block size, so you can make the censoring as subtle or as strong as you need.",
  },
  {
    question: "Can I censor multiple areas in one image?",
    answer: "Yes. You can select and apply the effect to multiple regions of the same image before downloading the final result.",
  },
];

const RELATED_TOOLS = [
  { name: "Add Text to Image", href: "/tools/add-text-to-image" },
  { name: "Redact PDF", href: "/tools/redact-pdf" },
  { name: "Image Crop", href: "/tools/crop-image" },
];

export default function BlurImageRegionPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <EyeOff className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Blur & Pixelate Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Censor sensitive parts of your images instantly in your browser.
        </p>
      </section>

      <BlurImageRegionWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
