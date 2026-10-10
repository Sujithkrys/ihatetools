import { Palette } from "lucide-react";
import { ColorPaletteExtractorWidget } from "@/components/ColorPaletteExtractorWidget";

export const metadata = {
  title: "Color Palette Extractor Online Free | iHateTools",
  description: "Extract the exact hex color palette from any photo or image instantly inside your browser.",
};

export default function ColorPaletteExtractorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Palette className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Color Palette Extractor
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Upload an image and instantly extract its dominant color scheme.
        </p>
      </section>

      <ColorPaletteExtractorWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Design Inspiration</h2>
          <p className="text-grey leading-relaxed mb-6">
            Find the perfect matching colors for your next design project. Our extractor algorithm samples pixels across a visual grid, identifies the most dominant colors, and guarantees high visual distinctiveness between the returned swatches so you get a usable palette, rather than 6 slightly different shades of the same color.
          </p>
        </section>
      </div>
    </div>
  );
}
