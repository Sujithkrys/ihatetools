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
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Add Watermark to PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Stamp custom text across all pages of your document securely and instantly.
        </p>
      </section>

      <AddWatermarkWidget />
    </div>
  );
}
