import React from 'react';

interface StickerProps {
  text: string;
  className?: string;
  color?: "yellow" | "cyan" | "pink" | "green" | "violet";
}

export function Sticker({ text, className = "", color = "yellow" }: StickerProps) {
  return (
    <div className={`absolute font-mono text-[10px] font-medium tracking-[0.05em] uppercase px-[11px] py-[6px] border-[1.5px] border-ink rounded-[5px] shadow-hard-sm bg-${color} ${className} whitespace-nowrap`}>
      {text}
    </div>
  );
}
