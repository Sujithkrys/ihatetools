import { ImageIcon } from "lucide-react";
import { ExtractPdfImagesWidget } from "@/components/ExtractPdfImagesWidget";

export const metadata = {
  title: "Extract Images from PDF Free | iHateTools",
  description: "Extract the embedded raw images from your PDF documents instantly securely in your browser.",
};

export default function ExtractPdfImagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <ImageIcon className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Extract Images from PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Extract all embedded images and photos from your PDF documents instantly, ready to download.
        </p>
      </section>

      <ExtractPdfImagesWidget />

      <div className="mt-24 space-y-12">
        <section className="bg-paper rounded-2xl p-8 border border-ink/10">
          <h2 className="text-2xl font-bold text-ink mb-4">Direct XObject Extraction</h2>
          <p className="text-grey leading-relaxed mb-6">
            Instead of just rendering the whole page to an image, this tool dives deep into the PDF dictionary to locate the original embedded image files (XObjects) and extracts them in their original quality. Because this runs entirely client-side, your confidential files are never uploaded to our servers.
          </p>
        </section>
      </div>
    </div>
  );
}
