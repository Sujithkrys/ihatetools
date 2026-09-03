import { LoremIpsumGeneratorWidget } from "@/components/LoremIpsumGeneratorWidget";

export const metadata = {
  title: "Lorem Ipsum Generator Online Free | iHateTools",
  description: "Instantly generate random Lorem Ipsum placeholder text by words or paragraphs for your mockups and designs.",
};

export default function LoremIpsumGeneratorPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          Lorem Ipsum Generator
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Generate random placeholder text instantly for your UI mockups and web designs.
        </p>
      </div>

      <LoremIpsumGeneratorWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Designer&apos;s Best Friend</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            Skip the bloated websites full of ads just to get some dummy text. Our generator instantly produces standard, randomized Latin placeholder text directly in your browser. Choose between words or full paragraphs, and copy it to your clipboard with a single click.
          </p>
        </section>
      </div>
    </div>
  );
}
