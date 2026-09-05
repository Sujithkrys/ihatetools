import { TextDiffCheckerWidget } from "@/components/TextDiffCheckerWidget";

export const metadata = {
  title: "Text Diff Checker Online Free | iHateTools",
  description: "Compare two text documents side-by-side to instantly find differences, additions, and deletions.",
};

export default function TextDiffCheckerPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Text Diff Checker
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Compare two text blocks to instantly spot additions and deletions.
        </p>
      </div>

      <TextDiffCheckerWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fast & Private Comparison</h2>
          <p className="text-grey leading-relaxed mb-6">
            Need to compare two versions of a code snippet, an essay, or a legal document? Paste the original text and the changed text to instantly see a color-coded inline diff. The comparison algorithm runs entirely in your browser memory—no data is ever sent over the network, ensuring complete confidentiality.
          </p>
        </section>
      </div>
    </div>
  );
}
