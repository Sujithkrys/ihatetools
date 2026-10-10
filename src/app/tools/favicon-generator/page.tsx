import { AppWindow } from "lucide-react";
import { FaviconGeneratorWidget } from "@/components/FaviconGeneratorWidget";

export const metadata = {
  title: "Favicon Generator Online Free | iHateTools",
  description: "Upload your logo to generate a complete Favicon package (PNGs, webmanifest) instantly.",
};

export default function FaviconGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <AppWindow className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Favicon Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate all necessary icon sizes for browsers, Apple Touch, and Android Web Manifests in one click.
        </p>
      </section>

      <FaviconGeneratorWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Complete Developer Package</h2>
          <p className="text-grey leading-relaxed mb-6">
            Forget about manually resizing your logo 10 different times. Upload a single square image (like an SVG or transparent PNG) and we automatically render perfectly sized assets for traditional desktop browsers, iOS homescreens, and Android PWAs, zipped up with a standard `site.webmanifest` file ready to drop into your root directory.
          </p>
        </section>
      </div>
    </div>
  );
}
