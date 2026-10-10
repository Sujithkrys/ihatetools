import { Metadata } from "next";
import { Fingerprint } from "lucide-react";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { UuidGeneratorWidget } from "@/components/UuidGeneratorWidget";

export const metadata: Metadata = {
  title: "Online UUID / GUID Generator - Bulk v4 Universally Unique IDs | ihatetools",
  description: "Generate RFC4122 Version 4 UUIDs in bulk. Customize hyphens, uppercase formatting, braces, and export as text or JSON. 100% client-side CSPRNG.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Select Quantity & Formats",
    description: "Choose how many UUIDs to produce (up to 500) and toggle uppercase, braces, or hyphens.",
  },
  {
    title: "Cryptographic Generation",
    description: "UUIDs are created using crypto.randomUUID() or high-entropy CSPRNG bytes conforming to RFC 4122 v4.",
  },
  {
    title: "Copy or Export",
    description: "Copy individual IDs, copy the entire list, or download as a TXT/JSON file instantly.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What version of UUID does this tool generate?",
    answer: "This tool generates Version 4 (v4) UUIDs based on cryptographically secure pseudorandom numbers according to RFC 4122.",
  },
  {
    question: "Can two generated UUIDs collide?",
    answer: "With 122 bits of random entropy, the probability of generating a duplicate v4 UUID is roughly 1 in 5.3 x 10^36, making collisions mathematically negligible.",
  },
  {
    question: "Are UUIDs generated on the server?",
    answer: "No. All generation happens locally within your browser using the Web Crypto API with zero network communication.",
  },
];

const RELATED_TOOLS = [
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "Password Generator", href: "/tools/password-generator" },
  { name: "URL Encoder / Decoder", href: "/tools/url-encoder-decoder" },
];

export default function UuidGeneratorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Fingerprint className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Utility Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          UUID / GUID Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate RFC 4122 compliant version 4 UUIDs individually or in bulk with zero latency.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / developer / uuid-generator">
        <UuidGeneratorWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
