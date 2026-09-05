import React from 'react';
import { CornerHandles } from './CornerHandles';

interface FrameProps {
  label: string;
  labelColor?: "yellow" | "cyan" | "violet" | "pink" | "green";
  showDim?: boolean;
  dimText?: string;
  children: React.ReactNode;
}

export function Frame({ label, labelColor = "yellow", showDim, dimText, children }: FrameProps) {
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow text-ink",
    cyan: "bg-cyan text-ink",
    violet: "bg-violet text-ink",
    pink: "bg-pink text-paper",
    green: "bg-green text-paper",
  };

  return (
    <section className="relative mb-[60px] md:mb-[104px] py-[30px] px-[20px] md:py-[44px] md:px-[40px]">
      <div className="absolute inset-0 border-[1.5px] border-sel opacity-55 pointer-events-none" />
      
      <span className={`frame-label tag absolute top-[-11px] left-[-1.5px] font-mono text-[9.5px] uppercase tracking-[0.08em] px-[8px] py-[3px] border-[1.5px] border-ink rounded-[4px] ${colorMap[labelColor]} whitespace-nowrap`}>
        {label}
      </span>
      
      <CornerHandles size={8} />
      
      {showDim && (
        <span className="hidden md:inline-block absolute bottom-[-11px] left-1/2 -translate-x-1/2 bg-sel text-paper font-mono text-[9px] px-[7px] py-[2px] rounded-[3px] whitespace-nowrap">
          {dimText || "1120 × 420"}
        </span>
      )}

      {children}
    </section>
  );
}
