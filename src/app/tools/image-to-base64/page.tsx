import { Code2 } from "lucide-react";
import { ImageToBase64Widget } from "@/components/ImageToBase64Widget";

export const metadata = {
  title: "Image to Base64 Converter Online Free | iHateTools",
  description: "Convert any image to a Base64 data URI string instantly in your browser. Perfect for CSS and HTML embedding.",
};

export default function ImageToBase64Page() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Code2 className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Image to Base64 Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Convert your images into copyable Base64 data URI strings for CSS or HTML embedding.
        </p>
      </section>

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
