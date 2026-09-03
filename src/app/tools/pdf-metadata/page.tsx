import { PdfMetadataWidget } from "@/components/PdfMetadataWidget";

export const metadata = {
  title: "Edit PDF Metadata Free | iHateTools",
  description: "View and edit PDF properties like title, author, subject, and keywords.",
};

export default function PdfMetadataPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          Edit PDF Metadata
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          View and edit PDF properties like title, author, subject, and keywords securely in your browser.
        </p>
      </div>

      <PdfMetadataWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Manage Document Properties</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Every PDF contains hidden metadata that describes the document. Use this tool to inspect the current metadata of your file, and easily update the title, author, or keywords before sharing it.
          </p>
        </section>
      </div>
    </div>
  );
}
