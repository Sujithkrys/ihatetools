import { Metadata } from "next";
import { PdfToJpgWidget } from "@/components/PdfToJpgWidget";

export const metadata: Metadata = {
  title: "PDF to JPG | ihatetools",
  description: "Convert each page of a PDF into a high-quality JPG image.",
};

export default function PdfToJpgPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          PDF to JPG
        </h1>
        <p className="text-textSecondary text-lg">
          Extract every page of a PDF into a high-quality JPG image entirely in your browser.
        </p>
      </section>

      <PdfToJpgWidget />
    </div>
  );
}
