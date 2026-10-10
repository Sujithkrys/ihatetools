import { Metadata } from "next";
import { Droplet } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { AddWatermarkWidget } from "@/components/AddWatermarkWidget";

export const metadata: Metadata = {
  title: "Add Watermark to PDF | ihatetools",
  description: "Stamp custom text onto your PDF pages securely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Drag and drop or select the PDF you want to watermark.",
  },
  {
    title: "Enter Text & Set Opacity",
    description: "Type the watermark text and adjust the opacity slider to control how strongly it shows through the page.",
  },
  {
    title: "Stamp & Download",
    description: "The text is stamped diagonally across every page in your browser, then you download the watermarked PDF.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded anywhere?",
    answer: "No. The watermark is applied entirely on your device, so the document content never leaves your browser.",
  },
  {
    question: "Can I control how visible the watermark is?",
    answer: "Yes. An opacity slider lets you set the watermark anywhere from a faint 10 percent to a bold 80 percent.",
  },
  {
    question: "Does the watermark apply to every page?",
    answer: "Yes. The same text is stamped diagonally across every page of the document automatically.",
  },
  {
    question: "Can I remove a watermark I added later?",
    answer: "Since the watermark is drawn onto the page content, it cannot be stripped out automatically. Keep a copy of your original, unwatermarked PDF if you may need it again.",
  },
];

const RELATED_TOOLS = [
  { name: "Protect PDF", href: "/tools/add-password" },
  { name: "Add Page Numbers", href: "/tools/add-page-numbers" },
  { name: "Redact PDF", href: "/tools/redact-pdf" },
];

export default function AddWatermarkPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Droplet className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Add Watermark to PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Stamp custom text across all pages of your document securely and instantly.
        </p>
      </section>

      <AddWatermarkWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
