import { AddPageNumbersWidget } from "@/components/AddPageNumbersWidget";

export const metadata = {
  title: "Add Page Numbers to PDF Free | iHateTools",
  description: "Easily add page numbers to your PDF documents in seconds.",
};

export default function AddPageNumbersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Add Page Numbers
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Add page numbers to your PDF documents in seconds directly in your browser.
        </p>
      </div>

      <AddPageNumbersWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Number Your Pages Instantly</h2>
          <p className="text-grey leading-relaxed mb-6">
            Easily paginate your PDF files. Choose exactly where you want the numbers to appear and specify the starting digit for seamless integration with existing documents.
          </p>
        </section>
      </div>
    </div>
  );
}
