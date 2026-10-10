import { Metadata } from "next";
import { Droplet } from "lucide-react";
import { AddWatermarkWidget } from "@/components/AddWatermarkWidget";

export const metadata: Metadata = {
  title: "Add Watermark to PDF | ihatetools",
  description: "Stamp custom text onto your PDF pages securely in your browser.",
};

export default function AddWatermarkPage() {
  return (
    <div className="flex flex-col items-start pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Droplet className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Add Watermark to PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Stamp custom text across all pages of your document securely and instantly.
        </p>
      </section>

      <AddWatermarkWidget />
    </div>
  );
}
