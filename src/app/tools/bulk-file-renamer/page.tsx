import { Metadata } from "next";
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Bulk File Renamer
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
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
