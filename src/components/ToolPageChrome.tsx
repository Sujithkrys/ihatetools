import React from 'react';

interface ToolPageChromeProps {
  breadcrumbs: string;
}

export function ToolPageChrome({ breadcrumbs }: ToolPageChromeProps) {
  return (
    <div className="border-b border-ink/8 dark:border-white/8 px-[18px] py-[11px] bg-ink/[0.015] dark:bg-white/[0.02] font-sans font-medium text-[11px] tracking-[0.02em] text-grey">
      {breadcrumbs}
    </div>
  );
}
