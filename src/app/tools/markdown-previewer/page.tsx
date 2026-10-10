import { Metadata } from "next";
import { FileCode } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { MarkdownPreviewerWidget } from "@/components/MarkdownPreviewerWidget";

export const metadata: Metadata = {
  title: "Online Markdown Previewer & HTML Converter | ihatetools",
  description: "Live side-by-side Markdown editor with instant HTML preview, GitHub Flavored Markdown (GFM) support, syntax shortcuts, and export options. 100% client-side.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Write or Paste Markdown",
    description: "Compose or paste markdown text in the editor or click the toolbar buttons for quick formatting.",
  },
  {
    title: "Instant Live Rendering",
    description: "The preview panel compiles and formats headings, lists, tables, quotes, and code blocks in real time.",
  },
  {
    title: "Copy or Export",
    description: "Copy raw Markdown or compiled HTML, or download a standalone HTML file with one click.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does this previewer support GitHub Flavored Markdown (GFM)?",
    answer: "Yes. GFM features including tables, task lists, code block language highlighting, and auto-linked URLs are fully supported.",
  },
  {
    question: "Can I use HTML tags inside the Markdown editor?",
    answer: "Yes, standard HTML tags inside Markdown are parsed and rendered according to standard CommonMark specifications.",
  },
  {
    question: "Is my text private?",
    answer: "Absolutely. Everything runs completely in your local browser environment. No documents, notes, or code are sent to external servers.",
  },
];

const RELATED_TOOLS = [
  { name: "URL Encoder / Decoder", href: "/tools/url-encoder-decoder" },
  { name: "JSON Formatter", href: "/tools/json-formatter" },
  { name: "UUID Generator", href: "/tools/uuid-generator" },
];

export default function MarkdownPreviewerPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileCode className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Markdown Previewer
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Edit Markdown with a synchronized real-time live preview, syntax formatting, and one-click HTML export.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / developer / markdown-previewer">
        <MarkdownPreviewerWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
