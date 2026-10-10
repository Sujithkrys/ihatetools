import { Metadata } from "next";
import { QrCode } from "lucide-react";
import { QrCodeWidget } from "@/components/QrCodeWidget";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "QR Code Generator | ihatetools",
  description: "Generate high-quality QR codes from text or URLs instantly.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Enter Your Text or URL",
    description: "Type or paste the text, link, or other content you want encoded into a QR code.",
  },
  {
    title: "Generate the QR Code",
    description: "The code is generated instantly in your browser as you type, with a live preview you can review.",
  },
  {
    title: "Download Your QR Code",
    description: "Save the finished QR code as an image, ready to print or share.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is the content I enter sent to a server to generate the QR code?",
    answer: "No. The QR code is generated entirely in your browser, so whatever text or URL you enter never leaves your device.",
  },
  {
    question: "Do these QR codes expire or stop working?",
    answer: "No. The codes encode your content directly, with no third-party redirect or tracking link, so they work indefinitely as long as the encoded URL or text remains valid.",
  },
  {
    question: "What file format is the downloaded QR code?",
    answer: "QR codes can be downloaded as standard image files, making them easy to insert into documents, flyers, or websites.",
  },
  {
    question: "Is there a limit to how much text a QR code can hold?",
    answer: "QR codes can hold a few thousand characters, but shorter content such as a URL produces a cleaner, easier-to-scan code.",
  },
];

const RELATED_TOOLS = [
  { name: "Barcode Generator", href: "/tools/barcode-generator" },
  { name: "Favicon Generator", href: "/tools/favicon-generator" },
  { name: "Image to Base64", href: "/tools/image-to-base64" },
];

export default function QrCodePage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <QrCode className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          QR Code Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate custom QR codes from any text or URL instantly.
        </p>
      </section>

      <QrCodeWidget />

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
