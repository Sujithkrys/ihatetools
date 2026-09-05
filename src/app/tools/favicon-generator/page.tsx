import { FaviconGeneratorWidget } from "@/components/FaviconGeneratorWidget";

export const metadata = {
  title: "Favicon Generator Online Free | iHateTools",
  description: "Upload your logo to generate a complete Favicon package (PNGs, webmanifest) instantly.",
};

export default function FaviconGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight font-display">
          Favicon Generator
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Generate all necessary icon sizes for browsers, Apple Touch, and Android Web Manifests in one click.
        </p>
      </div>

      <FaviconGeneratorWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-overlay/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Complete Developer Package</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Forget about manually resizing your logo 10 different times. Upload a single square image (like an SVG or transparent PNG) and we automatically render perfectly sized assets for traditional desktop browsers, iOS homescreens, and Android PWAs, zipped up with a standard `site.webmanifest` file ready to drop into your root directory.
          </p>
        </section>
      </div>
    </div>
  );
}
