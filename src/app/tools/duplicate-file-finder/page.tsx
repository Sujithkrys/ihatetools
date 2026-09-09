import { Metadata } from "next";
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
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Duplicate File Finder
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
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
