import { RotatePdfWidget } from "@/components/RotatePdfWidget";

export const metadata = {
  title: "Rotate PDF Pages Free | iHateTools",
  description: "Rotate all pages in your PDF document instantly. Turn your pages 90 degrees or 180 degrees upside down.",
};

export default function RotatePdfPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Rotate PDF
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Rotate all pages in your PDF document instantly in your browser.
        </p>
      </div>

      <RotatePdfWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fix Sideways PDFs Instantly</h2>
          <p className="text-grey leading-relaxed mb-6">
            Scanned a document upside down or sideways? This tool allows you to apply a bulk 90-degree or 180-degree rotation to every single page in your document instantly. 
            No more reading with a tilted head.
          </p>
        </section>
      </div>
    </div>
  );
}
