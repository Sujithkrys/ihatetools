import { Target } from "lucide-react";
import { CompressImageTargetSizeWidget } from "@/components/CompressImageTargetSizeWidget";

export const metadata = {
  title: "Compress Image to Target Size Free | iHateTools",
  description: "Specify an exact maximum file size in KB and compress your image to fit perfectly securely in your browser.",
};

export default function CompressImageTargetSizePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Target className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Compress Image to Target Size
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Need an image under 100KB for an upload? Specify your exact target size and let us calculate the best quality to hit it.
        </p>
      </section>

      <CompressImageTargetSizeWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Precision Iterative Compression</h2>
          <p className="text-grey leading-relaxed mb-6">
            Instead of guessing quality percentages, you can specify exactly how many Kilobytes your image needs to be. Our engine uses an advanced binary-search algorithm to compress your photo iteratively in the browser, finding the highest possible visual quality that still fits under your strict file size limit.
          </p>
        </section>
      </div>
    </div>
  );
}
