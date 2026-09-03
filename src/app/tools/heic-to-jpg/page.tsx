import { HeicToJpgWidget } from "@/components/HeicToJpgWidget";

export const metadata = {
  title: "HEIC to JPG Converter Free | iHateTools",
  description: "Convert Apple HEIC photos to standard JPG images directly in your browser. Fast, free, and secure.",
};

export default function HeicToJpgPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary tracking-tight">
          HEIC to JPG Converter
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Convert Apple iPhone photos (HEIC) to universally compatible JPG images. 
          Everything runs securely in your browser—no files are sent to a server.
        </p>
      </div>

      <HeicToJpgWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-surface rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Why convert HEIC to JPG?</h2>
          <p className="text-textSecondary leading-relaxed mb-6">
            HEIC is Apple&apos;s high-efficiency image format, used by default on modern iPhones and iPads. While it saves space, it is not widely supported on Windows PCs, older Android devices, or many web platforms. Converting your HEIC files to JPG ensures they can be opened, viewed, and shared anywhere.
          </p>
        </section>
      </div>
    </div>
  );
}
