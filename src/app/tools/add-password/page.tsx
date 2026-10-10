import { Metadata } from "next";
import { Lock } from "lucide-react";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { AddPasswordWidget } from "@/components/AddPasswordWidget";

export const metadata: Metadata = {
  title: "Protect PDF - Free Online PDF Encryption | ihatetools",
  description: "Add a password to your PDF file securely with AES-256.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload Your PDF",
    description: "Select the PDF file you want to lock with a password.",
  },
  {
    title: "Set a Password",
    description: "Enter the password you want required to open the document.",
  },
  {
    title: "Encrypt & Download",
    description: "The file is encrypted with AES-256 directly in your browser, then you download the protected PDF.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Does the encryption happen on a server?",
    answer: "No. Your PDF and password are processed entirely on your device, so the unprotected file and your chosen password are never transmitted anywhere.",
  },
  {
    question: "What encryption standard is used?",
    answer: "Your PDF is encrypted with AES-256, the same strong standard used by banks and enterprise security software.",
  },
  {
    question: "What happens if I forget the password?",
    answer: "There is no way to recover a lost password. Since the encryption happens locally and nothing is stored, you will need the original file and a new password to try again.",
  },
  {
    question: "Can I remove the password later?",
    answer: "Yes. Use the Unlock PDF tool with the correct password to decrypt the file and remove the protection.",
  },
];

const RELATED_TOOLS = [
  { name: "Unlock PDF", href: "/tools/remove-password" },
  { name: "Add Watermark", href: "/tools/add-watermark" },
  { name: "Redact PDF", href: "/tools/redact-pdf" },
];

export default function AddPasswordPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Lock className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Protect PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Add a password to your PDF file securely. Uses AES-256 encryption.
        </p>
      </section>
      <AddPasswordWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
