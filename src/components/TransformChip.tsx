import React from 'react';
import { type ToolCategory } from '@/lib/tools-data';

interface TransformChipProps {
  beforeText?: string;
  afterText?: string | string[];
  arrowText?: string;
  isStacked?: boolean;
  category: ToolCategory;
}

export function TransformChip({ beforeText, afterText, arrowText, isStacked, category }: TransformChipProps) {
  if (!beforeText) return null;

  let bgClass = "bg-yellow text-ink";
  if (category === "Image Tools") bgClass = "bg-cyan text-ink";
  else if (category === "Text Tools") bgClass = "bg-violet text-ink";

  // For text tools with only one icon
  if (!afterText) {
    return (
      <div className="flex items-center gap-[11px] mb-[18px]">
        <div className={`w-[33px] h-[40px] border-[1.5px] border-ink rounded-[5px] flex items-center justify-center font-mono text-[9px] shrink-0 ${bgClass}`}>
          {beforeText}
        </div>
      </div>
    );
  }

  // Before → After motif
  return (
    <div className="flex items-center gap-[11px] mb-[18px]">
      {/* Before */}
      <div className={`relative w-[33px] h-[40px] border-[1.5px] border-ink rounded-[5px] bg-bg flex items-center justify-center font-mono text-[9px] text-grey shrink-0 z-10`}>
        {beforeText}
        {isStacked && (
          <div className="absolute -inset-[1.5px] border-[1.5px] border-ink rounded-[5px] bg-bg translate-x-[4px] translate-y-[-4px] -z-10" />
        )}
      </div>
      
      {/* Arrow */}
      {arrowText && (
        <div className="font-mono text-[14px] text-pink font-medium">
          {arrowText}
        </div>
      )}
      
      {/* After */}
      {Array.isArray(afterText) ? (
        <div className="flex items-center gap-1">
          {afterText.map((text, i) => (
             <div key={i} className={`w-[25px] h-[31px] border-[1.5px] border-ink rounded-[5px] flex items-center justify-center font-mono text-[8px] shrink-0 ${i === 0 ? bgClass : 'bg-bg text-grey'}`}>
               {text}
             </div>
          ))}
        </div>
      ) : (
        <div className={`w-[33px] h-[40px] border-[1.5px] border-ink rounded-[5px] flex items-center justify-center font-mono text-[9px] shrink-0 ${bgClass}`}>
          {afterText}
        </div>
      )}
    </div>
  );
}
