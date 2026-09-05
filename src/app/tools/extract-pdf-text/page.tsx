import { ExtractPdfTextWidget } from "@/components/ExtractPdfTextWidget";

export const metadata = {
  title: "Extract Text from PDF Free | iHateTools",
  description: "Extract the embedded text from your PDF documents instantly securely in your browser.",
};

export default function ExtractPdfTextPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight font-display">
          Extract Text from PDF
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Extract the embedded text from your PDF documents instantly, ready to copy or download.
        </p>
      </div>

      <ExtractPdfTextWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-overlay/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Fast Text Extraction</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            If your PDF has real embedded text (not just scanned images), this tool will instantly extract it into a clean, copyable format. Since it runs entirely in your browser, your document contents remain 100% private and secure. 
            If your document is scanned, try our OCR tool instead.
          </p>
        </section>
      </div>
    </div>
  );
}
