import { RotateImageWidget } from "@/components/RotateImageWidget";

export const metadata = {
  title: "Rotate Image Online Free | iHateTools",
  description: "Rotate your images 90 degrees left, right, or 180 degrees securely in your browser.",
};

export default function RotateImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight font-sans">
          Rotate Image
        </h1>
        <p className="text-lg text-grey max-w-2xl mx-auto">
          Fix sideways or upside-down photos instantly.
        </p>
      </div>

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
