import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon?: LucideIcon;
  beforeIcon?: LucideIcon;
  afterIcon?: LucideIcon;
  name: string;
  description: string;
  href: string;
  category?: string;
}

export function ToolCard({ icon: Icon, beforeIcon: BeforeIcon, afterIcon: AfterIcon, name, description, href, category }: ToolCardProps) {
  // Determine accent colors and text
  let textAccent = "group-hover:text-accent";
  let borderAccent = "group-hover:border-accent/30";
  let badgeBg = "bg-accent/10 text-accent";

  if (category === "Image Tools") {
    textAccent = "group-hover:text-accentSecondary";
    borderAccent = "group-hover:border-accentSecondary/30";
    badgeBg = "bg-accentSecondary/10 text-accentSecondary";
  } else if (category === "Text Tools" || category === "Developer Tools") {
    textAccent = "group-hover:text-accentTertiary";
    borderAccent = "group-hover:border-accentTertiary/30";
    badgeBg = "bg-accentTertiary/10 text-accentTertiary";
  }

  // Transform Motif logic
  let Motif = null;
  if (category === "PDF Tools") {
    Motif = (
      <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4 6h12v12H4z" />
          <path d="M8 2h12v12" />
        </svg>
      </div>
    );
  } else if (category === "Image Tools") {
    Motif = (
      <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="12" height="12" />
          <rect x="9" y="9" width="12" height="12" />
        </svg>
      </div>
    );
  } else if (category === "Text Tools" || category === "Developer Tools") {
    Motif = (
      <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity font-mono text-7xl leading-none">
        &#123;&#125;
      </div>
    );
  }

  return (
    <Link 
      href={href}
      className="group relative flex flex-col p-8 bg-surface border border-overlay/10 rounded-card transition-all duration-300 hover:bg-surfaceHover hover:border-overlay/20 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
    >
      {Motif}
      
      {/* Category Badge */}
      {category && (
        <div className="absolute top-6 right-6 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeBg}`}>
            {category}
          </span>
        </div>
      )}

      {/* Icon Area */}
      <div className="relative z-10 mb-6 flex items-center gap-2">
        {BeforeIcon && AfterIcon ? (
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-background border border-overlay/5 ${textAccent} ${borderAccent} transition-colors`}>
              <BeforeIcon className="w-5 h-5 text-textMuted group-hover:text-inherit transition-colors" />
            </div>
            <ArrowRight className="w-4 h-4 text-overlay/30" />
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-background border border-overlay/5 ${textAccent} ${borderAccent} transition-colors`}>
              <AfterIcon className="w-5 h-5 text-textMuted group-hover:text-inherit transition-colors" />
            </div>
          </div>
        ) : Icon ? (
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-background border border-overlay/5 ${textAccent} ${borderAccent} transition-colors`}>
            <Icon className="w-6 h-6 text-textMuted group-hover:text-inherit transition-colors" />
          </div>
        ) : null}
      </div>

      <h3 className={`relative z-10 text-xl font-semibold text-textPrimary mb-3 ${textAccent} transition-colors`}>
        {name}
      </h3>
      <p className="relative z-10 text-textSecondary text-base leading-relaxed line-clamp-2">
        {description}
      </p>
    </Link>
  );
}
