import { PdfToPngWidget } from "@/components/PdfToPngWidget";

export const metadata = {
  title: "PDF to PNG Converter Free | iHateTools",
  description: "Convert your PDF pages to high-quality PNG images securely in your browser with transparent rendering options.",
};

export default function PdfToPngPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          PDF to PNG Converter
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Convert your PDF document into high-quality PNG images instantly.
        </p>
      </div>

      <PdfToPngWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Lossless Image Extraction</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            While JPEG is great for photos, PNG is a lossless format that excels at rendering sharp text, line art, and graphics. Use this tool when you need pixel-perfect representations of your PDF pages without the compression artifacts associated with JPEGs.
          </p>
        </section>
      </div>
    </div>
  );
}
