import { Metadata } from "next";
import { CopyCheck } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { DuplicateFileFinderWidget } from "@/components/DuplicateFileFinderWidget";

export const metadata: Metadata = {
  title: "Duplicate File Finder - Find Identical Files Client-Side | ihatetools",
  description: "Identify exact duplicate files using SHA-256 cryptographic checksums directly in your browser. Calculate wasted disk space with zero cloud uploads.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload File Collection",
    description: "Drop photos, documents, videos, or archives to analyze.",
  },
  {
    title: "Client-Side SHA-256 Hash",
    description: "Your browser computes unique cryptographic hashes for each file to detect identical content regardless of filename.",
  },
  {
    title: "Review & Audit Storage",
    description: "Duplicate clusters are clearly grouped with calculated wasted disk space.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does it compare filenames or file content?",
    answer: "It hashes the exact byte contents of each file using SHA-256. Even if two files have completely different names or extensions, they are flagged if their actual binary content is identical.",
  },
  {
    question: "Are my files uploaded to a cloud server for hashing?",
    answer: "No. All hashing is performed directly on your device via the browser's hardware-accelerated Web Crypto API.",
  },
  {
    question: "Will it detect edited photos or modified documents?",
    answer: "This tool is designed to find exact binary duplicates. If a single pixel or word is modified, the file is recognized as unique.",
  },
];

const RELATED_TOOLS = [
  { name: "Bulk File Renamer", href: "/tools/bulk-file-renamer" },
  { name: "PDF Compare", href: "/tools/pdf-compare" },
  { name: "Compress Image", href: "/tools/compress-image" },
];

export default function DuplicateFileFinderPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <CopyCheck className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Duplicate File Finder
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Scan files client-side with SHA-256 cryptographic hashing to isolate exact byte-for-byte duplicates.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / utility / duplicate-finder">
        <DuplicateFileFinderWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
