import { Metadata } from "next";
import { CropImageWidget } from "@/components/CropImageWidget";

export const metadata: Metadata = {
  title: "Image Crop | ihatetools",
  description: "Crop and extract a specific region from an image entirely in your browser.",
};

export default function CropImagePage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display">
          Image Crop
        </h1>
        <p className="text-textSecondary text-lg">
          Interactively crop and extract regions from your images without quality loss.
        </p>
      </section>

      <CropImageWidget />
    </div>
  );
}
