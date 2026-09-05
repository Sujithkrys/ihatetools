import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
  category?: string;
}

export function ToolCard({ icon: Icon, name, description, href, category }: ToolCardProps) {
  // Determine motif based on category
  let Motif = null;
  
  if (category === "PDF Tools") {
    Motif = (
      <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4 6h12v12H4z" />
          <path d="M8 2h12v12" />
        </svg>
      </div>
    );
  } else if (category === "Image Tools") {
    Motif = (
      <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="12" height="12" />
          <rect x="9" y="9" width="12" height="12" />
        </svg>
      </div>
    );
  } else if (category === "Text Tools" || category === "Developer Tools") {
    Motif = (
      <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity font-mono text-5xl leading-none">
        &#123;&#125;
      </div>
    );
  }

  return (
    <Link 
      href={href}
      className="group relative block p-6 bg-surface border border-overlay/10 rounded-card transition-all duration-200 hover:bg-surfaceHover hover:border-overlay/20 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
    >
      {Motif}
      <div className="relative z-10 mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-background border border-overlay/5 group-hover:border-accent/30 group-hover:text-accent transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="relative z-10 text-lg font-semibold text-textPrimary mb-2 group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="relative z-10 text-textSecondary text-sm line-clamp-1">
        {description}
      </p>
    </Link>
  );
}
