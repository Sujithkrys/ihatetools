import { Metadata } from "next";
import { AddWatermarkWidget } from "@/components/AddWatermarkWidget";

export const metadata: Metadata = {
  title: "Add Watermark to PDF | ihatetools",
  description: "Stamp custom text onto your PDF pages securely in your browser.",
};

export default function AddWatermarkPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Add Watermark to PDF
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Stamp custom text across all pages of your document securely and instantly.
        </p>
      </section>

      <AddWatermarkWidget />
    </div>
  );
}
