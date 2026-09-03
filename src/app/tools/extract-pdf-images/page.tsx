import { ExtractPdfImagesWidget } from "@/components/ExtractPdfImagesWidget";

export const metadata = {
  title: "Extract Images from PDF Free | iHateTools",
  description: "Extract the embedded raw images from your PDF documents instantly securely in your browser.",
};

export default function ExtractPdfImagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          Extract Images from PDF
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Extract all embedded images and photos from your PDF documents instantly, ready to download.
        </p>
      </div>

      <ExtractPdfImagesWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Direct XObject Extraction</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Instead of just rendering the whole page to an image, this tool dives deep into the PDF dictionary to locate the original embedded image files (XObjects) and extracts them in their original quality. Because this runs entirely client-side, your confidential files are never uploaded to our servers.
          </p>
        </section>
      </div>
    </div>
  );
}
