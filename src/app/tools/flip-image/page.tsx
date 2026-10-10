import { FlipHorizontal } from "lucide-react";
import { FlipImageWidget } from "@/components/FlipImageWidget";

export const metadata = {
  title: "Flip Image Online Free | iHateTools",
  description: "Mirror and flip your images horizontally or vertically securely in your browser.",
};

export default function FlipImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FlipHorizontal className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Flip Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Mirror your photos horizontally or vertically in one click.
        </p>
      </section>

      <FlipImageWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Instant Image Mirroring</h2>
          <p className="text-grey leading-relaxed mb-6">
            Selfies backwards? Need a mirrored version of a graphic? Our tool lets you instantly flip your images horizontally (left-to-right) or vertically (upside-down). Since it relies entirely on local canvas rendering, there are zero server uploads and no wait times.
          </p>
        </section>
      </div>
    </div>
  );
}
