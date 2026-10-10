import { Metadata } from "next";
import { FileEdit } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { BulkFileRenamerWidget } from "@/components/BulkFileRenamerWidget";

export const metadata: Metadata = {
  title: "Bulk File Renamer - Batch Rename Files Online | ihatetools",
  description: "Rename hundreds of files at once using sequential numbering, prefix/suffix additions, find & replace, and case transforms. Download as ZIP.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload File Collection",
    description: "Drag and drop any group of photos, PDFs, or data files.",
  },
  {
    title: "Define Rename Rules",
    description: "Choose sequential numbering, prefix/suffix tags, find and replace text, or letter casing.",
  },
  {
    title: "Download ZIP Archive",
    description: "Review the live name preview for each file and download the entire renamed collection in a single ZIP file.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Do my files get uploaded to a server?",
    answer: "No! All file reading, name mapping, and ZIP compression occur completely in your browser's memory using JSZip.",
  },
  {
    question: "Are file extensions preserved?",
    answer: "Yes, by default the tool automatically retains original file extensions (e.g. .png, .jpg, .pdf) so your files remain fully functional.",
  },
  {
    question: "How many files can I rename simultaneously?",
    answer: "You can rename dozens to hundreds of files at a time depending on your device's available memory.",
  },
];

const RELATED_TOOLS = [
  { name: "Duplicate File Finder", href: "/tools/duplicate-file-finder" },
  { name: "Barcode Generator", href: "/tools/barcode-generator" },
  { name: "Merge PDF", href: "/tools/merge-pdf" },
];

export default function BulkFileRenamerPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileEdit className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Bulk File Renamer
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Batch rename files with custom patterns, sequential indexing, and instant ZIP download.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / utility / bulk-renamer">
        <BulkFileRenamerWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
