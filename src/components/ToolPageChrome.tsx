import React from 'react';

interface ToolPageChromeProps {
  breadcrumbs: string;
}

export function ToolPageChrome({ breadcrumbs }: ToolPageChromeProps) {
  return (
    <div className="border-b-[1.5px] border-ink px-[16px] py-[10px] flex items-center gap-[8px] bg-bg font-mono text-[10px] uppercase tracking-[0.06em] text-grey">
      <div className="w-[9px] h-[9px] rounded-full border-[1.5px] border-ink bg-pink" />
      <div className="w-[9px] h-[9px] rounded-full border-[1.5px] border-ink bg-yellow" />
      <div className="w-[9px] h-[9px] rounded-full border-[1.5px] border-ink bg-green" />
      <span className="ml-[6px]">{breadcrumbs}</span>
    </div>
  );
}
