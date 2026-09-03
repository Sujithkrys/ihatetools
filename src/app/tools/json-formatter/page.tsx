import { JsonFormatterWidget } from "@/components/JsonFormatterWidget";

export const metadata = {
  title: "JSON Formatter & Validator Online Free | iHateTools",
  description: "Format, validate, and minify JSON data instantly in your browser. Clean up messy JSON code.",
};

export default function JsonFormatterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          JSON Formatter
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Format, validate, and minify JSON instantly in your browser.
        </p>
      </div>

      <JsonFormatterWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Secure & Fast</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            When you&apos;re dealing with sensitive API payloads, you shouldn&apos;t have to paste them into random online servers just to format them. Our JSON Formatter works entirely in your browser using the native `JSON.parse` and `JSON.stringify` engine. Your data never leaves your computer, ensuring total privacy.
          </p>
        </section>
      </div>
    </div>
  );
}
