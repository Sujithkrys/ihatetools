import { RotateCw } from "lucide-react";
import { RotateImageWidget } from "@/components/RotateImageWidget";

export const metadata = {
  title: "Rotate Image Online Free | iHateTools",
  description: "Rotate your images 90 degrees left, right, or 180 degrees securely in your browser.",
};

export default function RotateImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <RotateCw className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Rotate Image
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Fix sideways or upside-down photos instantly.
        </p>
      </section>

      <RotateImageWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Fast & Private Rotation</h2>
          <p className="text-grey leading-relaxed mb-6">
            Our rotate tool uses your browser&apos;s native canvas capabilities to rapidly flip and turn your photos without ever uploading them to a server. This means lightning-fast adjustments and 100% total privacy for your personal images.
          </p>
        </section>
      </div>
    </div>
  );
}
