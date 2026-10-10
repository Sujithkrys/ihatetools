import { EyeOff } from "lucide-react";
import { BlurImageRegionWidget } from "@/components/BlurImageRegionWidget";

export const metadata = {
  title: "Blur & Pixelate Image Parts Online Free | iHateTools",
  description: "Easily censor sensitive information like faces, license plates, or documents by blurring or pixelating specific regions of an image.",
};

export default function BlurImageRegionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <EyeOff className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Blur & Pixelate Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Censor sensitive parts of your images instantly in your browser.
        </p>
      </section>

      <BlurImageRegionWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Total Privacy Guaranteed</h2>
          <p className="text-grey leading-relaxed mb-6">
            When you need to redact sensitive documents, hide license plates, or censor faces, the last thing you want to do is upload that unredacted image to a remote server. This tool performs all blurring and pixelation directly on your device using native HTML5 Canvas, ensuring the original image never leaves your computer.
          </p>
        </section>
      </div>
    </div>
  );
}
