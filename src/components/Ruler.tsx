import React from 'react';

export function Ruler() {
  const ticks = Array.from({ length: 50 });

  return (
    <div className="h-[22px] border-b border-[#E2E0DC] dark:border-ink/20 bg-paper relative overflow-hidden font-mono text-[8px] text-[#B9B6B1] dark:text-grey hidden sm:block">
      {ticks.map((_, i) => (
        <span 
          key={i} 
          style={{ left: `${i * 50}px` }} 
          className="absolute top-[5px] border-l border-[#DEDCD8] dark:border-ink/20 pl-[3px] h-[12px]"
        >
          {i * 50}
        </span>
      ))}
    </div>
  );
}
