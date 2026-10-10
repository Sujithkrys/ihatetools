import { Metadata } from "next";
import { CircleDashed } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { RoundImageWidget } from "@/components/RoundImageWidget";

export const metadata: Metadata = {
  title: "Round Image Corners Online Free | iHateTools",
  description: "Apply rounded corners or circle crops to your images instantly in your browser and download as transparent PNG.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Image",
    description: "Select or drag in the photo you want to turn into a profile picture or icon.",
  },
  {
    title: "Pick a Corner Radius or Circle Crop",
    description: "Choose a rounded corner radius or switch to a full circle crop and preview the result live.",
  },
  {
    title: "Download the Transparent PNG",
    description: "Save the result as a PNG with the removed corners rendered fully transparent.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Will the rounded corners actually be transparent?",
    answer: "Yes. The areas removed by the rounded corners or circle crop become fully transparent, and the file is automatically exported as a PNG to preserve that transparency.",
  },
  {
    question: "Is my image uploaded to a server?",
    answer: "No. The rounding and cropping happens entirely in your browser, so your image is never sent anywhere during processing.",
  },
  {
    question: "What output format do I get?",
    answer: "The tool always exports a high-quality PNG, since that is the only common format that supports the transparent background created by rounding.",
  },
  {
    question: "Can I use this for app icons and social media avatars?",
    answer: "Yes, the circle crop mode is ideal for profile pictures and avatars, while the rounded corner mode suits app icons and UI thumbnails.",
  },
];

const RELATED_TOOLS = [
  { name: "Image Crop", href: "/tools/crop-image" },
  { name: "Favicon Generator", href: "/tools/favicon-generator" },
  { name: "Image Resizer", href: "/tools/resize-image" },
];

export default function RoundImagePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <CircleDashed className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Rounded Corners & Circle Crop
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Create perfect profile pictures and app icons with rounded corners or full circle crops.
        </p>
      </section>

      <RoundImageWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
