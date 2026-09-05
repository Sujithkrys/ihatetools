import { Metadata } from "next";
import { ImagesToPdfWidget } from "@/components/ImagesToPdfWidget";

export const metadata: Metadata = {
  title: "Images to PDF | ihatetools",
  description: "Combine multiple images into a single PDF document locally.",
};

export default function ImagesToPdfPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Images to PDF
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Combine JPGs and PNGs into a single PDF document. Everything runs completely in your browser.
        </p>
      </section>

      <ImagesToPdfWidget />
    </div>
  );
}
