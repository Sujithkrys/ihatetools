import { FileText } from "lucide-react";
import { WordCounterWidget } from "@/components/WordCounterWidget";

export const metadata = {
  title: "Word & Character Counter Online Free | iHateTools",
  description: "Live count of words, characters, characters without spaces, paragraphs, and reading time.",
};

export default function WordCounterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <FileText className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Word Counter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Type or paste your text for instant word, character, and paragraph statistics.
        </p>
      </section>

      <WordCounterWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fast & Private</h2>
          <p className="text-grey leading-relaxed mb-6">
            Perfect for meeting Twitter character limits, writing essays with strict word counts, or estimating the reading time of your blog post. Our live text editor computes statistics locally in real-time as you type, meaning your text is never sent to any server.
          </p>
        </section>
      </div>
    </div>
  );
}
