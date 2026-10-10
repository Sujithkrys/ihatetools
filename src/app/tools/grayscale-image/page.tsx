import { Paintbrush } from "lucide-react";
import { GrayscaleImageWidget } from "@/components/GrayscaleImageWidget";

export const metadata = {
  title: "Grayscale Image Online Free | iHateTools",
  description: "Convert colored photos to black and white or adjust grayscale intensity securely in your browser.",
};

export default function GrayscaleImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Paintbrush className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Grayscale Image Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Instantly convert your images to black and white or adjust color intensity.
        </p>
      </section>

      <GrayscaleImageWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Black & White Filter</h2>
          <p className="text-grey leading-relaxed mb-6">
            Turn vibrant photos into dramatic black and white images with a simple slider. Whether you want a fully desaturated image or just a subtle muted tone, our client-side filter engine processes the transformation instantly, keeping your files completely private.
          </p>
        </section>
      </div>
    </div>
  );
}
