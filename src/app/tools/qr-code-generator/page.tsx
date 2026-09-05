import { Metadata } from "next";
import { QrCodeWidget } from "@/components/QrCodeWidget";

export const metadata: Metadata = {
  title: "QR Code Generator | ihatetools",
  description: "Generate high-quality QR codes from text or URLs instantly.",
};

export default function QrCodePage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          QR Code Generator
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Generate custom QR codes from any text or URL instantly.
        </p>
      </section>

      <QrCodeWidget />
    </div>
  );
}
