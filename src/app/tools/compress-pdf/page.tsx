import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { CompressPdfWidget } from "@/components/CompressPdfWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Compress PDF - Free Online PDF Optimizer | ihatetools",
  description: "Reduce PDF file size securely and instantly. 100% free, private, client-side optimization.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload your PDF",
    description: "Drop your PDF into the upload area. It never leaves your browser.",
  },
  {
    title: "Optimize",
    description: "Our tool restructures the internal PDF objects and streams to save space without losing visual quality.",
  },
  {
    title: "Download",
    description: "Save your newly compressed PDF directly to your device.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Why didn't my file shrink very much?",
    answer: "This tool optimizes the PDF structure. If your PDF is massive because it contains dozens of high-resolution JPEGs, structural compression won't help much — those images need to be re-encoded to see massive savings.",
  },
  {
    question: "Is this tool completely private?",
    answer: "Yes! All optimization happens locally in your web browser. No data is sent to our servers.",
  },
];

const RELATED_TOOLS = [
  { name: "Merge PDF", href: "/tools/merge-pdf" },
  { name: "Split PDF", href: "/tools/split-pdf" },
];

export default function CompressPdfPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Compress PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Optimize your PDF file size without losing quality. 100% secure and local.
        </p>
      </section>

      <ToolWidgetShell>
        <CompressPdfWidget />
      </ToolWidgetShell>

      <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
      <FAQAccordion items={FAQ_ITEMS} />
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  );
}
