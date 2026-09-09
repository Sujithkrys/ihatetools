import { AddTextToImageWidget } from "@/components/AddTextToImageWidget";

export const metadata = {
  title: "Add Text to Image Online Free | iHateTools",
  description: "Easily add captions, text, and labels to your images directly in your browser. Fast and private.",
};

export default function AddTextToImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Add Text to Image
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
          Caption your photos, add watermarks, or create memes instantly.
        </p>
      </div>

      <AddTextToImageWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Meme Ready</h2>
          <p className="text-grey leading-relaxed mb-6">
            Quickly caption images with a classic bold font style. We automatically apply a soft stroke/outline to your text so it remains readable regardless of the background color behind it. Your image editing happens locally inside your browser cache.
          </p>
        </section>
      </div>
    </div>
  );
}
