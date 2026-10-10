import { Metadata } from "next";
import { Palette } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { ColorPaletteExtractorWidget } from "@/components/ColorPaletteExtractorWidget";

export const metadata: Metadata = {
  title: "Color Palette Extractor Online Free | iHateTools",
  description: "Extract the exact hex color palette from any photo or image instantly inside your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Image",
    description: "Drop in a photo or design file in JPG, PNG, or WEBP format directly in the browser.",
  },
  {
    title: "Pixel Sampling & Clustering",
    description: "The image is downscaled and sampled pixel by pixel, grouping similar colors and filtering out near-duplicates for visual distinctiveness.",
  },
  {
    title: "Copy Hex Codes",
    description: "Click any swatch in the resulting palette to copy its exact hex value to your clipboard.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my image uploaded to a server?",
    answer: "No. The entire extraction process runs on-device using the canvas API, so your image never leaves your browser.",
  },
  {
    question: "How does the tool pick which colors to show?",
    answer: "It samples pixels across a scaled-down version of the image, tallies the most frequent colors, and enforces a minimum distance between swatches so you get a usable, visually distinct palette instead of several near-identical shades.",
  },
  {
    question: "What image formats are supported?",
    answer: "JPG, PNG, and WEBP files all work, including images with transparency.",
  },
  {
    question: "Can I use the extracted colors commercially?",
    answer: "Yes. The hex codes are just numeric color values with no licensing restrictions attached to the source image.",
  },
];

const RELATED_TOOLS = [
  { name: "Favicon Generator", href: "/tools/favicon-generator" },
  { name: "Image Compressor", href: "/tools/compress-image" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
];

export default function ColorPaletteExtractorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Palette className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Color Palette Extractor
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Upload an image and instantly extract its dominant color scheme.
        </p>
      </section>

      <ColorPaletteExtractorWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
