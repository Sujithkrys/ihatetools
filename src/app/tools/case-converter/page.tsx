import { CaseUpper } from "lucide-react";
import { CaseConverterWidget } from "@/components/CaseConverterWidget";

export const metadata = {
  title: "Case Converter Online Free | iHateTools",
  description: "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
};

export default function CaseConverterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <CaseUpper className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Case Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Convert text instantly between UPPERCASE, lowercase, Title Case, and code cases.
        </p>
      </section>

      <CaseConverterWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Code Ready</h2>
          <p className="text-grey leading-relaxed mb-6">
            Stop manually retyping long variable names. Paste any text string and instantly convert it to camelCase, snake_case, or kebab-case. Since the text processing happens strictly within your browser, you can safely use it to transform sensitive internal identifiers or database keys.
          </p>
        </section>
      </div>
    </div>
  );
}
