import { Metadata } from "next";
import { Lock } from "lucide-react";
import { AddPasswordWidget } from "@/components/AddPasswordWidget";

export const metadata: Metadata = {
  title: "Protect PDF - Free Online PDF Encryption | ihatetools",
  description: "Add a password to your PDF file securely with AES-256.",
};

export default function AddPasswordPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Lock className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Protect PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Add a password to your PDF file securely. Uses AES-256 encryption.
        </p>
      </section>
      <AddPasswordWidget />
    </div>
  );
}
