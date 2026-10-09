import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { RemoveBackgroundWidget } from "@/components/RemoveBackgroundWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Remove Image Background | ihatetools",
  description: "Remove backgrounds from images instantly in your browser. Free, private, client-side AI processing.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload image",
    description: "Drop your JPG, PNG, or WEBP image. It never leaves your device.",
  },
  {
    title: "Auto-Remove",
    description: "Our AI model removes the background instantly right in your browser.",
  },
  {
    title: "Download",
    description: "Download the result as a transparent PNG, or add a solid background color first.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this tool completely private?",
    answer: "Yes! The AI model runs entirely locally in your web browser. Your images are never sent to a server.",
  },
  {
    question: "Why does it download an AI model?",
    answer: "Since the background removal happens completely on your device without a server, we need to download a small (~40MB) AI model once per session to power it.",
  }
];

const RELATED_TOOLS = [
  { name: "Image Resizer", href: "/tools/resize-image" },
  { name: "Convert Image Format", href: "/tools/convert-image" },
];

export default function RemoveBackgroundPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Remove Background
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
          Remove backgrounds from any image instantly. 100% private.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / image / remove-background">
        <RemoveBackgroundWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
