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
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          Organize PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Reorder, rotate, and delete PDF pages. 100% secure and runs locally.
        </p>
      </section>

      <OrganizePdfWidget />
    </div>
  );
}
