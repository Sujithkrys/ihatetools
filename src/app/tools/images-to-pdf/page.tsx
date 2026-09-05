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
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Images to PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Combine JPGs and PNGs into a single PDF document. Everything runs completely in your browser.
        </p>
      </section>

      <ImagesToPdfWidget />
    </div>
  );
}
