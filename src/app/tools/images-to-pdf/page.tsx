import { Metadata } from "next";
import { Files } from "lucide-react";
import { ImagesToPdfWidget } from "@/components/ImagesToPdfWidget";

export const metadata: Metadata = {
  title: "Images to PDF | ihatetools",
  description: "Combine multiple images into a single PDF document locally.",
};

export default function ImagesToPdfPage() {
  return (
    <div className="flex flex-col items-start pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Files className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Images to PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Combine JPGs and PNGs into a single PDF document. Everything runs completely in your browser.
        </p>
      </section>

      <ImagesToPdfWidget />
    </div>
  );
}
