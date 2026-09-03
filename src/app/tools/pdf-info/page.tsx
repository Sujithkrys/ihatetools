import { PdfInfoWidget } from "@/components/PdfInfoWidget";

export const metadata = {
  title: "PDF Info Viewer Free | iHateTools",
  description: "View hidden metadata, page count, PDF version, and properties of any PDF document securely in your browser.",
};

export default function PdfInfoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          PDF Info Viewer
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Instantly view page count, file size, PDF version, and hidden metadata of any PDF document. Fast, free, and secure.
        </p>
      </div>

      <PdfInfoWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Discover Hidden Document Data</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            PDF files often contain invisible metadata such as the author name, creation date, and software used to generate the file. This tool extracts and displays all standard document properties in a clean, easy-to-read format directly in your browser.
          </p>
        </section>
      </div>
    </div>
  );
}
