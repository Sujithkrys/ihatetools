import { AlignLeft } from "lucide-react";
import { LoremIpsumGeneratorWidget } from "@/components/LoremIpsumGeneratorWidget";

export const metadata = {
  title: "Lorem Ipsum Generator Online Free | iHateTools",
  description: "Instantly generate random Lorem Ipsum placeholder text by words or paragraphs for your mockups and designs.",
};

export default function LoremIpsumGeneratorPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <AlignLeft className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Text Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Lorem Ipsum Generator
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Generate random placeholder text instantly for your UI mockups and web designs.
        </p>
      </section>

      <LoremIpsumGeneratorWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Designer&apos;s Best Friend</h2>
          <p className="text-grey leading-relaxed mb-6">
            Skip the bloated websites full of ads just to get some dummy text. Our generator instantly produces standard, randomized Latin placeholder text directly in your browser. Choose between words or full paragraphs, and copy it to your clipboard with a single click.
          </p>
        </section>
      </div>
    </div>
  );
}
