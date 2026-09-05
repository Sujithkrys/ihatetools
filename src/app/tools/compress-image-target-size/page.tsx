import { CompressImageTargetSizeWidget } from "@/components/CompressImageTargetSizeWidget";

export const metadata = {
  title: "Compress Image to Target Size Free | iHateTools",
  description: "Specify an exact maximum file size in KB and compress your image to fit perfectly securely in your browser.",
};

export default function CompressImageTargetSizePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight font-display">
          Compress Image to Target Size
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Need an image under 100KB for an upload? Specify your exact target size and let us calculate the best quality to hit it.
        </p>
      </div>

      <CompressImageTargetSizeWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-overlay/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Precision Iterative Compression</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Instead of guessing quality percentages, you can specify exactly how many Kilobytes your image needs to be. Our engine uses an advanced binary-search algorithm to compress your photo iteratively in the browser, finding the highest possible visual quality that still fits under your strict file size limit.
          </p>
        </section>
      </div>
    </div>
  );
}
