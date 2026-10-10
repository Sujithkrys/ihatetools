import { CircleDashed } from "lucide-react";
import { RoundImageWidget } from "@/components/RoundImageWidget";

export const metadata = {
  title: "Round Image Corners Online Free | iHateTools",
  description: "Apply rounded corners or circle crops to your images instantly in your browser and download as transparent PNG.",
};

export default function RoundImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <CircleDashed className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Rounded Corners & Circle Crop
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Create perfect profile pictures and app icons with rounded corners or full circle crops.
        </p>
      </section>

      <RoundImageWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Transparent PNG Export</h2>
          <p className="text-grey leading-relaxed mb-6">
            When you apply a circle crop or rounded corners, the areas that are removed become completely transparent. We guarantee this transparency is preserved by automatically exporting your final image as a high-quality PNG. This happens entirely in your browser without any server uploads.
          </p>
        </section>
      </div>
    </div>
  );
}
