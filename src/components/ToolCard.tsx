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
  return (
    <Link 
      href={href}
      className="block bg-paper border-[1.5px] border-ink rounded-[11px] p-6 shadow-hard cursor-pointer transition-all duration-150 hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-hard-hover"
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
