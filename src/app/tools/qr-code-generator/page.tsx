import { Metadata } from "next";
import { QrCode } from "lucide-react";
import { QrCodeWidget } from "@/components/QrCodeWidget";

export const metadata: Metadata = {
  title: "QR Code Generator | ihatetools",
  description: "Generate high-quality QR codes from text or URLs instantly.",
};

export default function QrCodePage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
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
    </div>
  );
}
