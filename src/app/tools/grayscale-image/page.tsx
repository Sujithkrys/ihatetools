import { GrayscaleImageWidget } from "@/components/GrayscaleImageWidget";

export const metadata = {
  title: "Grayscale Image Online Free | iHateTools",
  description: "Convert colored photos to black and white or adjust grayscale intensity securely in your browser.",
};

export default function GrayscaleImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Grayscale Image Converter
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Instantly convert your images to black and white or adjust color intensity.
        </p>
      </div>

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
