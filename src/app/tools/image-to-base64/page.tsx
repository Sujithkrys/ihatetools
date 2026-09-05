import { ImageToBase64Widget } from "@/components/ImageToBase64Widget";

export const metadata = {
  title: "Image to Base64 Converter Online Free | iHateTools",
  description: "Convert any image to a Base64 data URI string instantly in your browser. Perfect for CSS and HTML embedding.",
};

export default function ImageToBase64Page() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Image to Base64 Converter
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Convert your images into copyable Base64 data URI strings for CSS or HTML embedding.
        </p>
      </div>

      <ImageToBase64Widget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fast & Private Encoding</h2>
          <p className="text-grey leading-relaxed mb-6">
            Easily convert SVG, PNG, JPG, or WebP files into Base64 strings to inline them directly into your HTML documents or CSS stylesheets. The conversion happens instantly in your browser using the native FileReader API, so your images are never uploaded to our servers.
          </p>
        </section>
      </div>
    </div>
  );
}
