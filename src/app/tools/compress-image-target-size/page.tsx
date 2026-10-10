import { Metadata } from "next";
import { Target } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { CompressImageTargetSizeWidget } from "@/components/CompressImageTargetSizeWidget";

export const metadata: Metadata = {
  title: "Compress Image to Target Size Free | iHateTools",
  description: "Specify an exact maximum file size in KB and compress your image to fit perfectly securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Image",
    description: "Choose a JPG, PNG, or WEBP file from your device to compress.",
  },
  {
    title: "Set Your Target Size",
    description: "Enter the exact maximum file size in KB you need, for example 100KB for a form upload.",
  },
  {
    title: "Binary-Search Compression",
    description: "The tool iteratively adjusts quality using a binary-search algorithm until the output fits under your limit, then it's ready to download.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How accurate is the final file size?",
    answer: "The binary-search algorithm iterates on quality until the output lands at or just under your specified KB target, typically within a few percent of the exact limit.",
  },
  {
    question: "Is my image uploaded anywhere?",
    answer: "No. Compression happens entirely in your browser using the canvas API, so your image is never sent to a server.",
  },
  {
    question: "Will the image quality suffer if my target size is very small?",
    answer: "Hitting a very small target size, such as under 20KB, on a large or detailed photo may noticeably reduce sharpness, since quality has to drop further to meet the limit.",
  },
  {
    question: "What file formats are supported?",
    answer: "You can upload JPG, PNG, or WEBP images, and the compressed output is returned as a JPG or WEBP for the best size-to-quality ratio.",
  },
];

const RELATED_TOOLS = [
  { name: "Image Compressor", href: "/tools/compress-image" },
  { name: "Image Resizer", href: "/tools/resize-image" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
];

export default function CompressImageTargetSizePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Target className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Compress Image to Target Size
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Need an image under 100KB for an upload? Specify your exact target size and let us calculate the best quality to hit it.
        </p>
      </section>

      <CompressImageTargetSizeWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
