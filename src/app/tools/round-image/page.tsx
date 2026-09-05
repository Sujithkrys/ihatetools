import { RoundImageWidget } from "@/components/RoundImageWidget";

export const metadata = {
  title: "Round Image Corners Online Free | iHateTools",
  description: "Apply rounded corners or circle crops to your images instantly in your browser and download as transparent PNG.",
};

export default function RoundImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Rounded Corners & Circle Crop
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Create perfect profile pictures and app icons with rounded corners or full circle crops.
        </p>
      </div>

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
