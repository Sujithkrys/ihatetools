import { BlurImageRegionWidget } from "@/components/BlurImageRegionWidget";

export const metadata = {
  title: "Blur & Pixelate Image Parts Online Free | iHateTools",
  description: "Easily censor sensitive information like faces, license plates, or documents by blurring or pixelating specific regions of an image.",
};

export default function BlurImageRegionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Blur & Pixelate Image
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Censor sensitive parts of your images instantly in your browser.
        </p>
      </div>

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
