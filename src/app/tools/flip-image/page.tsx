import { FlipImageWidget } from "@/components/FlipImageWidget";

export const metadata = {
  title: "Flip Image Online Free | iHateTools",
  description: "Mirror and flip your images horizontally or vertically securely in your browser.",
};

export default function FlipImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Flip Image
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Mirror your photos horizontally or vertically in one click.
        </p>
      </div>

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
