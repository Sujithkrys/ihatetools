import { Binary } from "lucide-react";
import { Base64ToImageWidget } from "@/components/Base64ToImageWidget";

export const metadata = {
  title: "Base64 to Image Decoder Online Free | iHateTools",
  description: "Decode and render Base64 data URI strings back into downloadable image files instantly.",
};

export default function Base64ToImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Binary className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">Image Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Base64 to Image Decoder
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Paste a Base64 string to instantly render and download the image.
        </p>
      </section>

      <Base64ToImageWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Instant Decoding</h2>
          <p className="text-grey leading-relaxed mb-6">
            If you have an embedded CSS image or a JSON data payload containing a raw Base64 image string, just paste it here. We will instantly decode the text and render the visual image directly in your browser without uploading it to a server.
          </p>
        </section>
      </div>
    </div>
  );
}
