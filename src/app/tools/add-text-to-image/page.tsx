import { Metadata } from "next";
import { Type } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { AddTextToImageWidget } from "@/components/AddTextToImageWidget";

export const metadata: Metadata = {
  title: "Add Text to Image Online Free | iHateTools",
  description: "Easily add captions, text, and labels to your images directly in your browser. Fast and private.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload an Image",
    description: "Drag and drop or select the photo you want to caption.",
  },
  {
    title: "Type Your Text",
    description: "Enter your caption, choose the font size and color, and pick a vertical position for placement.",
  },
  {
    title: "Render & Download",
    description: "The text is drawn onto the image using an HTML5 canvas with an automatic outline for readability, then you download the result.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my image uploaded to a server?",
    answer: "No. The text is rendered directly onto your image using your browser's canvas, so the file never leaves your device.",
  },
  {
    question: "Why does my text have a dark outline?",
    answer: "A soft stroke is automatically applied behind the text so it stays readable whether the background behind it is light or dark.",
  },
  {
    question: "Can I control the font size and color?",
    answer: "Yes. You can adjust the font size in pixels and pick any text color before rendering the final image.",
  },
  {
    question: "What image formats are supported?",
    answer: "Common formats like JPG and PNG work well. The output is rendered as a new image file ready to download.",
  },
];

const RELATED_TOOLS = [
  { name: "Add Watermark", href: "/tools/add-watermark" },
  { name: "Blur & Pixelate Image", href: "/tools/blur-image-region" },
  { name: "Image Resizer", href: "/tools/resize-image" },
];

export default function AddTextToImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Type className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Add Text to Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Caption your photos, add watermarks, or create memes instantly.
        </p>
      </section>

      <AddTextToImageWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
