import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
}

export function ToolCard({ icon: Icon, name, description, href }: ToolCardProps) {
  return (
    <Link 
      href={href}
      className="group block p-6 bg-surface border border-white/10 rounded-card transition-all duration-200 hover:bg-surfaceHover hover:border-white/20 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-background border border-white/5 group-hover:border-accent/30 group-hover:text-accent transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-textPrimary mb-2 group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="text-textSecondary text-sm line-clamp-1">
        {description}
      </p>
    </Link>
  );
}
