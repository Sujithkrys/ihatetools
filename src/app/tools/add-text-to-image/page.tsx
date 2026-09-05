import { AddTextToImageWidget } from "@/components/AddTextToImageWidget";

export const metadata = {
  title: "Add Text to Image Online Free | iHateTools",
  description: "Easily add captions, text, and labels to your images directly in your browser. Fast and private.",
};

export default function AddTextToImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight font-display">
          Add Text to Image
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Caption your photos, add watermarks, or create memes instantly.
        </p>
      </div>

      <AddTextToImageWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-overlay/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Meme Ready</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Quickly caption images with a classic bold font style. We automatically apply a soft stroke/outline to your text so it remains readable regardless of the background color behind it. Your image editing happens locally inside your browser cache.
          </p>
        </section>
      </div>
    </div>
  );
}
