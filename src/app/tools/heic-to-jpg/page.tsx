import { ImagePlay } from "lucide-react";
import { HeicToJpgWidget } from "@/components/HeicToJpgWidget";

export const metadata = {
  title: "HEIC to JPG Converter Free | iHateTools",
  description: "Convert Apple HEIC photos to standard JPG images directly in your browser. Fast, free, and secure.",
};

export default function HeicToJpgPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ImagePlay className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          HEIC to JPG Converter
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Convert Apple iPhone photos (HEIC) to universally compatible JPG images.
          Everything runs securely in your browser, no files are sent to a server.
        </p>
      </section>

      <HeicToJpgWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Why convert HEIC to JPG?</h2>
          <p className="text-grey leading-relaxed mb-6">
            HEIC is Apple&apos;s high-efficiency image format, used by default on modern iPhones and iPads. While it saves space, it is not widely supported on Windows PCs, older Android devices, or many web platforms. Converting your HEIC files to JPG ensures they can be opened, viewed, and shared anywhere.
          </p>
        </section>
      </div>
    </div>
  );
}
