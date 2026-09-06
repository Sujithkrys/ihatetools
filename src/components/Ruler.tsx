"use client";

import React, { useEffect, useRef, useState } from 'react';

export function Ruler() {
  const rulerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth, { passive: true });

    const ruler = rulerRef.current;
    if (!ruler) return () => window.removeEventListener('resize', updateWidth);

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
        const drift = scrollY * 0.15;
        if (rulerRef.current) {
          rulerRef.current.style.transform = `translate3d(-${drift}px, 0, 0)`;
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially in case already scrolled on mount
    handleScroll();

    return () => {
      window.removeEventListener('resize', updateWidth);
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Determine tick density based on viewport width
  // Mobile (<640px): Major labeled ticks every 100px, mid ticks every 50px, minor ticks every 10px
  // Desktop (>=640px): Major labeled ticks every 50px, mid ticks every 25px, minor ticks every 10px
  const isNarrow = mounted ? viewportWidth < 640 : false;
  const majorStep = isNarrow ? 100 : 50;
  const midStep = isNarrow ? 50 : 25;
  const minorStep = 10;

  // Generate enough ticks to span the current viewport plus maximum drift capacity
  const totalCoverage = Math.max(viewportWidth + 2500, 4500);
  const tickCount = Math.ceil(totalCoverage / minorStep);
  const ticks = Array.from({ length: tickCount }, (_, i) => i * minorStep);

  return (
    <div className="h-[22px] border-b border-[#E2E0DC] dark:border-ink/20 bg-paper relative overflow-hidden font-sans font-semibold text-[8px] text-[#B9B6B1] dark:text-grey block select-none pointer-events-none">
      <div 
        id="site-ruler" 
        ref={rulerRef} 
        style={{ width: `${totalCoverage}px` }}
        className="absolute top-0 left-0 h-full will-change-transform"
      >
        {ticks.map((pos) => {
          const isMajor = pos % majorStep === 0;
          const isMid = !isMajor && pos % midStep === 0;

          if (isMajor) {
            return (
              <span 
                key={pos} 
                style={{ left: `${pos}px` }} 
                className="absolute top-[5px] border-l border-[#DEDCD8] dark:border-ink/20 pl-[3px] h-[12px] flex items-center leading-none"
              >
                {pos}
              </span>
            );
          }

          if (isMid) {
            return (
              <span 
                key={pos} 
                style={{ left: `${pos}px` }} 
                className="absolute top-[8px] border-l border-[#DEDCD8] dark:border-ink/20 h-[8px]" 
              />
            );
          }

          return (
            <span 
              key={pos} 
              style={{ left: `${pos}px` }} 
              className="absolute top-[12px] border-l border-[#E5E3DF] dark:border-ink/15 h-[5px]" 
            />
          );
        })}
      </div>
    </div>
  );
}

