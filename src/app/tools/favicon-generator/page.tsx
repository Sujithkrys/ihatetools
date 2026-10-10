import { Metadata } from "next";
import { AppWindow } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { FaviconGeneratorWidget } from "@/components/FaviconGeneratorWidget";

export const metadata: Metadata = {
  title: "Favicon Generator Online Free | iHateTools",
  description: "Upload your logo to generate a complete Favicon package (PNGs, webmanifest) instantly.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Logo",
    description: "Upload a square image, ideally an SVG or transparent PNG, to use as the source for your icons.",
  },
  {
    title: "Automatic Resizing",
    description: "The tool renders your logo into every required size for desktop browsers, Apple Touch icons, and Android PWAs.",
  },
  {
    title: "Download the Package",
    description: "Get a ZIP file with all icon sizes plus a ready-to-use site.webmanifest, ready to drop into your project's root directory.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What image format should I upload?",
    answer: "A square SVG or transparent PNG works best, since it scales cleanly to every icon size without distortion.",
  },
  {
    question: "Is my logo uploaded to a server?",
    answer: "No. All resizing happens locally in your browser using canvas, so your source image never leaves your device.",
  },
  {
    question: "What's included in the downloaded package?",
    answer: "The ZIP contains PNG favicons in multiple sizes for browsers, Apple Touch icons for iOS, Android PWA icons, and a site.webmanifest file ready to drop into your root directory.",
  },
  {
    question: "Do I need to resize my logo manually first?",
    answer: "No. Upload a single square image and the tool automatically generates every required size, so you don't need to resize it ten different times yourself.",
  },
];

const RELATED_TOOLS = [
  { name: "Color Palette Extractor", href: "/tools/color-palette-extractor" },
  { name: "Image Resizer", href: "/tools/resize-image" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
];

export default function FaviconGeneratorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <AppWindow className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Favicon Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate all necessary icon sizes for browsers, Apple Touch, and Android Web Manifests in one click.
        </p>
      </section>

      <FaviconGeneratorWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
