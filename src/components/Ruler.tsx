"use client";

import React, { useEffect, useRef } from 'react';

export function Ruler() {
  const rulerRef = useRef<HTMLDivElement>(null);
  const ticks = Array.from({ length: 160 });

  useEffect(() => {
    const ruler = rulerRef.current || document.getElementById('site-ruler');
    if (!ruler) return;

    const handleScroll = () => {
      const drift = window.scrollY * 0.15;
      ruler.style.transform = `translateX(-${drift}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially in case already scrolled
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="h-[22px] border-b border-[#E2E0DC] dark:border-ink/20 bg-paper relative overflow-hidden font-mono text-[8px] text-[#B9B6B1] dark:text-grey hidden sm:block select-none pointer-events-none">
      <div 
        id="site-ruler" 
        ref={rulerRef} 
        className="absolute top-0 left-0 w-[8000px] h-full will-change-transform"
      >
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
    </div>
  );
}
