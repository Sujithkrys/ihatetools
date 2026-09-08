import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { PasswordGeneratorWidget } from "@/components/PasswordGeneratorWidget";

export const metadata: Metadata = {
  title: "Secure Password Generator - Strong Cryptographic Passwords | ihatetools",
  description: "Generate cryptographically secure, high-entropy passwords with custom length and character sets. 100% on-device Web Crypto generation.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Configure Length & Characters",
    description: "Adjust length and toggle uppercase, lowercase, numbers, and special symbols.",
  },
  {
    title: "CSPRNG Generation",
    description: "Passwords are produced using window.crypto.getRandomValues for true cryptographic randomness.",
  },
  {
    title: "Check Strength & Copy",
    description: "Review calculated entropy bits and copy instantly to your clipboard.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this password generator genuinely random?",
    answer: "Yes. It uses the browser's native Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) via window.crypto.getRandomValues, which draws entropy from system hardware events, not Math.random().",
  },
  {
    question: "Are generated passwords saved or logged anywhere?",
    answer: "Never. Passwords exist only in your browser memory for as long as the page is open, with zero network requests or analytics.",
  },
  {
    question: "What length is considered secure?",
    answer: "A length of 16 characters or more with mixed character sets yields over 85 bits of entropy, which is considered unbreakable by modern brute-force computing standards.",
  },
];

const RELATED_TOOLS = [
  { name: "Bulk File Renamer", href: "/tools/bulk-file-renamer" },
  { name: "Duplicate File Finder", href: "/tools/duplicate-file-finder" },
  { name: "QR Code Generator", href: "/tools/qr-code-generator" },
];

export default function PasswordGeneratorPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Password Generator
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Generate high-entropy, cryptographically randomized passwords and passphrases client-side.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / utility / password-generator">
        <PasswordGeneratorWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
