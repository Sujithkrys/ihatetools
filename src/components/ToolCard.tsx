import Link from "next/link";
import { type ToolCategory } from "@/lib/tools-data";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  category: ToolCategory;
  icon?: LucideIcon;
  [key: string]: unknown;
}

export function ToolCard({ name, description, href, category, icon: Icon }: ToolCardProps) {
  let hoverBorderClass = "hover:border-yellow";
  let badgeClass = "badge-pdf";

  if (category === "Image Tools") {
    hoverBorderClass = "hover:border-cyan";
    badgeClass = "badge-img";
  } else if (category === "Text Tools") {
    hoverBorderClass = "hover:border-violet";
    badgeClass = "badge-txt";
  } else if (category === "Audio Tools") {
    hoverBorderClass = "hover:border-amber-500";
    badgeClass = "badge-aud";
  } else if (category === "Utility Tools") {
    hoverBorderClass = "hover:border-emerald-500";
    badgeClass = "badge-util";
  }

  return (
    <Link 
      href={href}
      className={`card block bg-paper border-[1.5px] border-ink rounded-[11px] p-6 cursor-pointer transition-all duration-150 hover:-translate-y-[2px] ${hoverBorderClass}`}
    >
      <div className={`badge ${badgeClass}`}>
        {Icon && <Icon size={19} strokeWidth={1.8} />}
      </div>
      <h3 className="disp text-[19px] mb-[7px] text-ink">{name}</h3>
      <p className="text-[13.5px] leading-[1.55] text-grey tracking-[-0.005em] line-clamp-2">{description}</p>
    </Link>
  );
}
