import { Base64ToImageWidget } from "@/components/Base64ToImageWidget";

export const metadata = {
  title: "Base64 to Image Decoder Online Free | iHateTools",
  description: "Decode and render Base64 data URI strings back into downloadable image files instantly.",
};

export default function Base64ToImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Base64 to Image Decoder
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Paste a Base64 string to instantly render and download the image.
        </p>
      </div>

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
