import { Metadata } from "next";
import { RemovePasswordWidget } from "@/components/RemovePasswordWidget";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove PDF Password | ihatetools",
  description: "Remove the password from a protected PDF file easily.",
};

export default function RemovePasswordPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Unlock PDF
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Remove the password from a protected PDF document.
        </p>
      </section>
      <RemovePasswordWidget />
    </div>
  );
}
