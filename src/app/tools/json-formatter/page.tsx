import { Braces } from "lucide-react";
import { JsonFormatterWidget } from "@/components/JsonFormatterWidget";

export const metadata = {
  title: "JSON Formatter & Validator Online Free | iHateTools",
  description: "Format, validate, and minify JSON data instantly in your browser. Clean up messy JSON code.",
};

export default function JsonFormatterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Braces className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          JSON Formatter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Format, validate, and minify JSON instantly in your browser.
        </p>
      </section>

      <JsonFormatterWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Secure & Fast</h2>
          <p className="text-grey leading-relaxed mb-6">
            When you&apos;re dealing with sensitive API payloads, you shouldn&apos;t have to paste them into random online servers just to format them. Our JSON Formatter works entirely in your browser using the native `JSON.parse` and `JSON.stringify` engine. Your data never leaves your computer, ensuring total privacy.
          </p>
        </section>
      </div>
    </div>
  );
}
