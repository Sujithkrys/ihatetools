import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedTool {
  name: string;
  href: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-12 pt-8 border-t border-white/10">
      <h3 className="text-lg font-medium text-textPrimary mb-6 flex items-center">
        Related Tools <ArrowRight className="ml-2 w-4 h-4 text-textMuted" />
      </h3>
      <div className="flex flex-wrap gap-4">
        {tools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            className="px-5 py-3 bg-surface border border-white/10 rounded-full text-sm font-medium text-textSecondary hover:text-textPrimary hover:border-white/20 hover:bg-surfaceHover transition-colors flex items-center gap-2"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
