import { Metadata } from "next";
import { ImagePlay } from "lucide-react";
import { HeicToJpgWidget } from "@/components/HeicToJpgWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter Free | iHateTools",
  description: "Convert Apple HEIC photos to standard JPG images directly in your browser. Fast, free, and secure.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your HEIC Photos",
    description: "Drop in one or more .heic files straight from your iPhone or iPad photo library.",
  },
  {
    title: "Automatic Decoding",
    description: "The tool decodes Apple's HEIC format in your browser and renders each photo onto a canvas.",
  },
  {
    title: "Download as JPG",
    description: "Each photo is re-encoded as a standard JPG file, ready to download individually or in bulk.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Why can't I open HEIC files on Windows or Android?",
    answer: "HEIC is Apple's high-efficiency image format, used by default on modern iPhones and iPads. While it saves space, it is not widely supported on Windows PCs, older Android devices, or many web platforms, so converting to JPG ensures the photo opens anywhere.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer: "No. The HEIC decoding and JPG conversion both happen locally in your browser, so your photos are never sent anywhere.",
  },
  {
    question: "Will the converted JPG lose quality?",
    answer: "There is a small amount of recompression inherent to the JPG format, but the resolution is preserved and the visual difference is negligible for everyday photos.",
  },
  {
    question: "Can I convert multiple HEIC files at once?",
    answer: "Yes, you can drop in several HEIC files together and convert and download them all in the same session.",
  },
];

const RELATED_TOOLS = [
  { name: "Convert Image Format", href: "/tools/convert-image" },
  { name: "Image Compressor", href: "/tools/compress-image" },
  { name: "Image Resizer", href: "/tools/resize-image" },
];

export default function HeicToJpgPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ImagePlay className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          HEIC to JPG Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Convert Apple iPhone photos (HEIC) to universally compatible JPG images.
          Everything runs securely in your browser, no files are sent to a server.
        </p>
      </section>

      <HeicToJpgWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
