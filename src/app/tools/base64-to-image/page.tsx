import { Metadata } from "next";
import { Binary } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { Base64ToImageWidget } from "@/components/Base64ToImageWidget";

export const metadata: Metadata = {
  title: "Base64 to Image Decoder Online Free | iHateTools",
  description: "Decode and render Base64 data URI strings back into downloadable image files instantly.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Paste the Base64 String",
    description: "Paste a raw Base64 string or a full data URI, such as one copied from CSS or a JSON payload.",
  },
  {
    title: "Automatic Decoding",
    description: "The string is decoded and rendered as an image directly in your browser, detecting the image format automatically.",
  },
  {
    title: "Preview & Download",
    description: "View the rendered image and download it as a standard image file.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does the decoded image get uploaded anywhere?",
    answer: "No. The Base64 string is decoded and rendered entirely in your browser, so the resulting image never touches a server.",
  },
  {
    question: "Do I need to paste a full data URI?",
    answer: "No. You can paste a raw Base64 string without the data:image/ prefix, and the tool will automatically treat it as a PNG if no prefix is present.",
  },
  {
    question: "What image formats are supported?",
    answer: "The tool detects the format from the data URI prefix, such as PNG, JPEG, GIF, or WebP, and names the downloaded file accordingly.",
  },
  {
    question: "What if the string fails to render?",
    answer: "Make sure you copied the complete Base64 string without extra whitespace or line breaks, since a truncated or corrupted string cannot be decoded into a valid image.",
  },
];

const RELATED_TOOLS = [
  { name: "Image to Base64", href: "/tools/image-to-base64" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
  { name: "Image Compressor", href: "/tools/compress-image" },
];

export default function Base64ToImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Binary className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Base64 to Image Decoder
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Paste a Base64 string to instantly render and download the image.
        </p>
      </section>

      <Base64ToImageWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
