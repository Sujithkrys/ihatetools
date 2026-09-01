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
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          QR Code Generator
        </h1>
        <p className="text-textSecondary text-lg">
          Generate custom QR codes from any text or URL instantly.
        </p>
      </section>

      <QrCodeWidget />
    </div>
  );
}
