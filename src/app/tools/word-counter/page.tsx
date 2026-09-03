import { WordCounterWidget } from "@/components/WordCounterWidget";

export const metadata = {
  title: "Word & Character Counter Online Free | iHateTools",
  description: "Live count of words, characters, characters without spaces, paragraphs, and reading time.",
};

export default function WordCounterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          Word Counter
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Type or paste your text for instant word, character, and paragraph statistics.
        </p>
      </div>

      <WordCounterWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Fast & Private</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Perfect for meeting Twitter character limits, writing essays with strict word counts, or estimating the reading time of your blog post. Our live text editor computes statistics locally in real-time as you type, meaning your text is never sent to any server.
          </p>
        </section>
      </div>
    </div>
  );
}
