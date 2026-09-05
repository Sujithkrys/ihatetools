import { Metadata } from "next";
import { AddPasswordWidget } from "@/components/AddPasswordWidget";

export const metadata: Metadata = {
  title: "Protect PDF - Free Online PDF Encryption | ihatetools",
  description: "Add a password to your PDF file securely with AES-256.",
};

export default function AddPasswordPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Protect PDF
        </h1>
        <p className="text-grey text-[16px] tracking-[-0.015em]">
          Add a password to your PDF file securely. Uses AES-256 encryption.
        </p>
      </section>
      <AddPasswordWidget />
    </div>
  );
}
