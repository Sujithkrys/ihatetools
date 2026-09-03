import { DeletePdfPagesWidget } from "@/components/DeletePdfPagesWidget";

export const metadata = {
  title: "Delete PDF Pages Free | iHateTools",
  description: "Remove unwanted pages from your PDF documents securely in your browser.",
};

export default function DeletePdfPagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          Delete PDF Pages
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Remove unwanted pages from your PDF documents securely in your browser.
        </p>
      </div>

      <DeletePdfPagesWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Trim Your PDF Documents</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Instantly remove blank pages, extra forms, or unnecessary content from your PDF files. Select the exact pages you want to eliminate using our visual preview grid and download a clean, updated document.
          </p>
        </section>
      </div>
    </div>
  );
}
