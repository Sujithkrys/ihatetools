import { Metadata } from "next";
import { Unlock } from "lucide-react";
import { RemovePasswordWidget } from "@/components/RemovePasswordWidget";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove PDF Password | ihatetools",
  description: "Remove the password from a protected PDF file easily.",
};

export default function RemovePasswordPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <Unlock className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Unlock PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Remove the password from a protected PDF document.
        </p>
      </section>
      <RemovePasswordWidget />
    </div>
  );
}
