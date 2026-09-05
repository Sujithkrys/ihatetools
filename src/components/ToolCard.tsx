import Link from "next/link";
import { type ToolCategory } from "@/lib/tools-data";
import { TransformChip } from "./TransformChip";

interface ToolCardProps {
  beforeText?: string;
  afterText?: string | string[];
  arrowText?: string;
  isStacked?: boolean;
  name: string;
  description: string;
  href: string;
  category: ToolCategory;
}

export function ToolCard({ beforeText, afterText, arrowText, isStacked, name, description, href, category }: ToolCardProps) {
  let hoverBorderClass = "hover:border-yellow";
  if (category === "Image Tools") hoverBorderClass = "hover:border-cyan";
  else if (category === "Text Tools") hoverBorderClass = "hover:border-violet";

  return (
    <Link 
      href={href}
      className={`card block bg-paper border-[1.5px] border-ink rounded-[11px] p-6 cursor-pointer transition-all duration-150 hover:-translate-y-[2px] ${hoverBorderClass}`}
    >
      <TransformChip 
        beforeText={beforeText} 
        afterText={afterText} 
        arrowText={arrowText} 
        isStacked={isStacked} 
        category={category} 
      />
      <h3 className="disp text-[19px] mb-[7px] text-ink">{name}</h3>
      <p className="text-[13.5px] leading-[1.55] text-grey tracking-[-0.005em] line-clamp-2">{description}</p>
    </Link>
  );
}
