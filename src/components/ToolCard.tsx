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
  return (
    <Link 
      href={href}
      className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group no-underline"
    >
      <div className="w-10 h-10 flex-shrink-0 bg-white/5 rounded-md flex items-center justify-center text-gray-400 group-hover:text-white transition-colors border border-white/5 group-hover:border-white/10">
        {Icon && <Icon size={18} strokeWidth={1.5} />}
      </div>
      <div className="flex-1 mt-0.5">
        <h3 className="text-[14px] font-semibold text-gray-200 mb-1 group-hover:text-white transition-colors leading-none">{name}</h3>
        <p className="text-[12px] leading-[1.4] text-gray-500 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
}
