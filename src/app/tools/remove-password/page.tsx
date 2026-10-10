import { Metadata } from "next";
import { Unlock } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { RemovePasswordWidget } from "@/components/RemovePasswordWidget";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove PDF Password | ihatetools",
  description: "Remove the password from a protected PDF file easily.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your Protected PDF",
    description: "Select or drag in the password-protected PDF file you need to unlock.",
  },
  {
    title: "Enter the Current Password",
    description: "Type in the existing password so the tool can open and decrypt the document.",
  },
  {
    title: "Download the Unlocked File",
    description: "Get a new copy of the PDF with the password restriction removed, ready to view or share freely.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Do I need to know the current password?",
    answer: "Yes. This tool removes an existing password restriction; it does not crack or guess unknown passwords. You must enter the correct password to unlock the file.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer: "No. The decryption happens entirely in your browser using JavaScript, so your file and its contents never leave your device.",
  },
  {
    question: "Will this affect the content or formatting of my PDF?",
    answer: "No. Only the password restriction is removed; all text, images, and layout remain exactly as they were in the original document.",
  },
  {
    question: "Can I re-lock the PDF later if needed?",
    answer: "Yes, you can always add a new password back to the unlocked file using the Protect PDF tool.",
  },
];

const RELATED_TOOLS = [
  { name: "Protect PDF", href: "/tools/add-password" },
  { name: "Merge PDF", href: "/tools/merge-pdf" },
  { name: "Compress PDF", href: "/tools/compress-pdf" },
];

export default function RemovePasswordPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Unlock className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Unlock PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Remove the password from a protected PDF document.
        </p>
      </section>
      <RemovePasswordWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
