import { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { OrganizePdfWidget } from "@/components/OrganizePdfWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "Organize PDF | ihatetools",
  description: "Reorder, rotate, and delete PDF pages entirely in your browser.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF whose pages you want to reorder, rotate, or remove.",
  },
  {
    title: "Drag, Rotate, or Delete Pages",
    description: "Use the page thumbnails to drag pages into a new order, rotate individual pages, or delete the ones you no longer need.",
  },
  {
    title: "Save Your Reorganized PDF",
    description: "Export the updated document with your new page order and layout applied.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is my PDF uploaded to a server to reorganize the pages?",
    answer: "No. All reordering, rotating, and deleting happens locally in your browser, and the file is never sent anywhere.",
  },
  {
    question: "Can I undo changes before saving?",
    answer: "Yes. You can rearrange, rotate, or restore pages freely in the editor before exporting, so nothing is final until you download the result.",
  },
  {
    question: "Does reordering pages affect PDF quality?",
    answer: "No. The original page content is preserved exactly; only the order, rotation, and presence of pages changes.",
  },
  {
    question: "Is there a limit to how many pages I can organize?",
    answer: "Since processing happens on your device, the practical limit depends on your browser and hardware rather than a fixed page count.",
  },
];

const RELATED_TOOLS = [
  { name: "Delete PDF Pages", href: "/tools/delete-pdf-pages" },
  { name: "Rotate PDF", href: "/tools/rotate-pdf" },
  { name: "Merge PDF", href: "/tools/merge-pdf" },
];

export default function OrganizePdfPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Organize PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Reorder, rotate, and delete PDF pages. 100% secure and runs locally.
        </p>
      </section>

      <OrganizePdfWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
