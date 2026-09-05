import { Metadata } from "next";
import { OrganizePdfWidget } from "@/components/OrganizePdfWidget";

export const metadata: Metadata = {
  title: "Organize PDF | ihatetools",
  description: "Reorder, rotate, and delete PDF pages entirely in your browser.",
};

export default function OrganizePdfPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Organize PDF
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Reorder, rotate, and delete PDF pages. 100% secure and runs locally.
        </p>
      </section>

      <OrganizePdfWidget />
    </div>
  );
}
