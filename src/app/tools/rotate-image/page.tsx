import { Metadata } from "next";
import { RotateCw } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { RotateImageWidget } from "@/components/RotateImageWidget";

export const metadata: Metadata = {
  title: "Rotate Image Online Free | iHateTools",
  description: "Rotate your images 90 degrees left, right, or 180 degrees securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Photo",
    description: "Select or drag in the image you need to straighten or turn.",
  },
  {
    title: "Rotate to the Correct Orientation",
    description: "Click left, right, or 180 degree rotation buttons until the photo looks right.",
  },
  {
    title: "Download the Fixed Image",
    description: "Save the correctly oriented image to your device in its original format and quality.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Will rotating my image reduce its quality?",
    answer: "No. The rotation is a lossless transform performed on the canvas, so the pixel data and resolution stay exactly the same.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer: "No. The tool uses your browser's native canvas capabilities to rotate images locally, so files never leave your device and loading is instant.",
  },
  {
    question: "What image formats are supported?",
    answer: "You can rotate common formats such as JPG, PNG, and WEBP, and the downloaded file keeps the same format as your original upload.",
  },
  {
    question: "Can I rotate by a custom angle instead of 90 or 180 degrees?",
    answer: "This tool focuses on quick 90 and 180 degree turns for fixing sideways or upside-down shots. For fine-grained framing, pair it with the Image Crop tool.",
  },
];

const RELATED_TOOLS = [
  { name: "Flip Image", href: "/tools/flip-image" },
  { name: "Image Crop", href: "/tools/crop-image" },
  { name: "Image Resizer", href: "/tools/resize-image" },
];

export default function RotateImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <RotateCw className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Rotate Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Fix sideways or upside-down photos instantly.
        </p>
      </section>

      <RotateImageWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
