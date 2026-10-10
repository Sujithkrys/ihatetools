import { Metadata } from "next";
import { Crop } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { CropImageWidget } from "@/components/CropImageWidget";

export const metadata: Metadata = {
  title: "Image Crop | ihatetools",
  description: "Crop and extract a specific region from an image entirely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Image",
    description: "Drag and drop or select a JPG, PNG, or WEBP image to load it into the cropper.",
  },
  {
    title: "Drag to Select a Region",
    description: "Use the interactive crop box to choose exactly the area you want to keep.",
  },
  {
    title: "Apply & Download",
    description: "The selected region is rendered to canvas at full resolution and downloaded with no quality loss.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does cropping reduce image quality?",
    answer: "No. The crop is rendered directly from the original image data at full resolution, so the cropped region keeps its original quality.",
  },
  {
    question: "Is my image uploaded to a server?",
    answer: "No. Cropping happens entirely client-side using canvas, so your image never leaves your device.",
  },
  {
    question: "What image formats can I crop?",
    answer: "JPG, PNG, and WEBP images are all supported for upload and download.",
  },
];

const RELATED_TOOLS = [
  { name: "Image Resizer", href: "/tools/resize-image" },
  { name: "Rotate Image", href: "/tools/rotate-image" },
  { name: "Image Compressor", href: "/tools/compress-image" },
];

export default function CropImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Crop className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Image Crop
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Interactively crop and extract regions from your images without quality loss.
        </p>
      </section>

      <CropImageWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
