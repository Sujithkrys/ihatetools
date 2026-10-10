import { Metadata } from "next";
import { Code2 } from "lucide-react";
import { ImageToBase64Widget } from "@/components/ImageToBase64Widget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Image to Base64 Converter Online Free | iHateTools",
  description: "Convert any image to a Base64 data URI string instantly in your browser. Perfect for CSS and HTML embedding.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload an Image",
    description: "Choose a JPG, PNG, WebP, GIF, or SVG file to encode.",
  },
  {
    title: "Automatic Base64 Encoding",
    description: "The browser's native FileReader API reads the file and encodes its binary data as a Base64 text string.",
  },
  {
    title: "Copy the Data URI",
    description: "Copy the ready-to-use data:image/... string and paste it directly into your HTML or CSS.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What file types can I encode?",
    answer: "You can encode JPG, PNG, WebP, and SVG files, which covers nearly every image format used in CSS and HTML embedding.",
  },
  {
    question: "Is my image uploaded to a server?",
    answer: "No. The conversion happens instantly in your browser using the native FileReader API, so your images are never uploaded to our servers.",
  },
  {
    question: "Why would I embed an image as Base64 instead of linking to a file?",
    answer: "Inlining a small image as Base64 removes an extra HTTP request, which is useful for icons, small background images, or self-contained HTML snippets and emails.",
  },
  {
    question: "Does Base64 encoding increase file size?",
    answer: "Yes, Base64 text is roughly 33% larger than the original binary file, so it's best suited to small images rather than large photos.",
  },
];

const RELATED_TOOLS = [
  { name: "Base64 to Image", href: "/tools/base64-to-image" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
  { name: "Image Compressor", href: "/tools/compress-image" },
];

export default function ImageToBase64Page() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Code2 className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Image to Base64 Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Convert your images into copyable Base64 data URI strings for CSS or HTML embedding.
        </p>
      </section>

      <ImageToBase64Widget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
