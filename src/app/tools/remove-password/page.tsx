import { Metadata } from "next";
import { RemovePasswordWidget } from "@/components/RemovePasswordWidget";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove PDF Password | ihatetools",
  description: "Remove the password from a protected PDF file easily.",
};

export default function RemovePasswordPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          Unlock PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Remove the password from a protected PDF document.
        </p>
      </section>
      <RemovePasswordWidget />
    </div>
  );
}
