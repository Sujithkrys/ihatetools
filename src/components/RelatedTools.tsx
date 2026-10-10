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
    <div className="w-full max-w-4xl mx-auto my-12 pt-8 border-t border-ink/8 dark:border-white/10">
      <h3 className="disp text-lg text-ink mb-6 flex items-center">
        Related Tools <ArrowRight className="ml-2 w-4 h-4 text-grey" />
      </h3>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            className="px-5 py-2.5 bg-paper border border-ink/8 dark:border-white/10 rounded-[9px] text-sm font-medium text-ink hover:-translate-y-[2px] hover:shadow-soft dark:hover:shadow-soft-dark hover:border-ink/15 dark:hover:border-white/20 transition-all"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
