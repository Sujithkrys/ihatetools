import { Type } from "lucide-react";
import { AddTextToImageWidget } from "@/components/AddTextToImageWidget";

export const metadata = {
  title: "Add Text to Image Online Free | iHateTools",
  description: "Easily add captions, text, and labels to your images directly in your browser. Fast and private.",
};

export default function AddTextToImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Type className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Add Text to Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Caption your photos, add watermarks, or create memes instantly.
        </p>
      </section>

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
