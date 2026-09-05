import { ColorPaletteExtractorWidget } from "@/components/ColorPaletteExtractorWidget";

export const metadata = {
  title: "Color Palette Extractor Online Free | iHateTools",
  description: "Extract the exact hex color palette from any photo or image instantly inside your browser.",
};

export default function ColorPaletteExtractorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight font-display">
          Color Palette Extractor
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Upload an image and instantly extract its dominant color scheme.
        </p>
      </div>

      <ColorPaletteExtractorWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-overlay/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Design Inspiration</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Find the perfect matching colors for your next design project. Our extractor algorithm samples pixels across a visual grid, identifies the most dominant colors, and guarantees high visual distinctiveness between the returned swatches so you get a usable palette, rather than 6 slightly different shades of the same color.
          </p>
        </section>
      </div>
    </div>
  );
}
