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
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Image Crop
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Interactively crop and extract regions from your images without quality loss.
        </p>
      </section>

      <CropImageWidget />
    </div>
  );
}
