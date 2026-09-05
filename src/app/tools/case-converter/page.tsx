import { CaseConverterWidget } from "@/components/CaseConverterWidget";

export const metadata = {
  title: "Case Converter Online Free | iHateTools",
  description: "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
};

export default function CaseConverterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Case Converter
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Convert text instantly between UPPERCASE, lowercase, Title Case, and code cases.
        </p>
      </div>

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
