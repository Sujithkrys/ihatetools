import { Diff } from "lucide-react";
import { TextDiffCheckerWidget } from "@/components/TextDiffCheckerWidget";

export const metadata = {
  title: "Text Diff Checker Online Free | iHateTools",
  description: "Compare two text documents side-by-side to instantly find differences, additions, and deletions.",
};

export default function TextDiffCheckerPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Diff className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Text Diff Checker
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Compare two text blocks to instantly spot additions and deletions.
        </p>
      </section>

      <TextDiffCheckerWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fast & Private Comparison</h2>
          <p className="text-grey leading-relaxed mb-6">
            Need to compare two versions of a code snippet, an essay, or a legal document? Paste the original text and the changed text to instantly see a color-coded inline diff. The comparison algorithm runs entirely in your browser memory, no data is ever sent over the network, ensuring complete confidentiality.
          </p>
        </section>
      </div>
    </div>
  );
}
