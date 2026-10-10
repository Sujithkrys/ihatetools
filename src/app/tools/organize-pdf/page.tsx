import { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { OrganizePdfWidget } from "@/components/OrganizePdfWidget";

export const metadata: Metadata = {
  title: "Organize PDF | ihatetools",
  description: "Reorder, rotate, and delete PDF pages entirely in your browser.",
};

export default function OrganizePdfPage() {
  return (
    <div className="flex flex-col items-start pt-16 pb-24 px-4 w-full max-w-content mx-auto">
      <section className="max-w-2xl mb-[32px]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-sel/8 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-[18px] h-[18px] text-sel" strokeWidth={1.75} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey">PDF Tools</span>
        </div>
        <h1 className="disp text-[28px] sm:text-[32px] text-ink leading-[1.25] mb-3.5">
          Organize PDF
        </h1>
        <p className="text-[15px] leading-[1.65] text-grey max-w-[52ch]">
          Reorder, rotate, and delete PDF pages. 100% secure and runs locally.
        </p>
      </section>

      <OrganizePdfWidget />
    </div>
  );
}
