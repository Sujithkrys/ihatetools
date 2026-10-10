"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, BadgeCheck } from "lucide-react";

interface ShowcaseCard {
  src: string;
  alt: string;
  path: string;
  href: string;
  width: number;
  height: number;
}

const CARDS: ShowcaseCard[] = [
  {
    src: "/images/hero-ats-card.png",
    alt: "ihatetools resume and job match checker showing a 67% keyword match score",
    path: "www.ihatetools.in/tools/resume-ats-checker",
    href: "/tools/resume-ats-checker",
    width: 1388,
    height: 812,
  },
  {
    src: "/images/hero-password-card.png",
    alt: "ihatetools password generator showing a generated high-entropy password",
    path: "www.ihatetools.in/tools/password-generator",
    href: "/tools/password-generator",
    width: 1520,
    height: 1418,
  },
  {
    src: "/images/hero-json-card.png",
    alt: "ihatetools JSON formatter showing formatted, color-highlighted JSON",
    path: "www.ihatetools.in/tools/json-formatter",
    href: "/tools/json-formatter",
    width: 1520,
    height: 840,
  },
];

export function HeroShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % CARDS.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused]);

  const card = CARDS[active];

  return (
    <div
      className="group relative hidden lg:block"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => setActive((i) => (i + 1) % CARDS.length)}
        aria-label="Show next tool preview"
        className="relative block w-full text-left rounded-[16px] border border-ink/10 dark:border-white/10 bg-paper dark:bg-bg shadow-soft-hover overflow-hidden rotate-[1.2deg] group-hover:rotate-0 transition-transform duration-500 cursor-pointer"
      >
        <div className="flex items-center gap-[6px] px-[14px] py-[10px] border-b border-ink/8 dark:border-white/10 bg-ink/[0.015] dark:bg-white/[0.02]">
          <span className="w-[9px] h-[9px] rounded-full bg-ink/15 dark:bg-white/20" />
          <span className="w-[9px] h-[9px] rounded-full bg-ink/15 dark:bg-white/20" />
          <span className="w-[9px] h-[9px] rounded-full bg-ink/15 dark:bg-white/20" />
          <span className="ml-[8px] text-[11px] font-mono text-grey truncate">{card.path}</span>
        </div>
        <div className="relative w-full aspect-[3/2] bg-paper dark:bg-bg">
          {CARDS.map((c, i) => (
            <Image
              key={c.src}
              src={c.src}
              alt={c.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-contain object-top transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
              priority={i === 0}
            />
          ))}
        </div>
      </button>

      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-[7px] mt-[14px]">
        {CARDS.map((c, i) => (
          <button
            key={c.src}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive(i);
            }}
            aria-label={`Show preview ${i + 1}`}
            className={`h-[6px] rounded-full transition-all ${i === active ? "w-[22px] bg-sel" : "w-[6px] bg-ink/15 dark:bg-white/20 hover:bg-ink/30 dark:hover:bg-white/35"}`}
          />
        ))}
      </div>

      <div className="absolute -bottom-[14px] -left-[14px] -z-10 w-full h-full rounded-[16px] bg-sel/10 dark:bg-sel/15" />

      {/* Floating badge chips for depth */}
      <div className="animate-float-chip absolute -top-[18px] -left-[22px] flex items-center gap-[7px] bg-paper dark:bg-[#1A1C1E] border border-ink/10 dark:border-white/10 rounded-[11px] px-[13px] py-[9px] shadow-soft-hover">
        <ShieldCheck className="w-[14px] h-[14px] text-sel" strokeWidth={2} />
        <span className="text-[12px] font-semibold text-ink">100% client-side</span>
      </div>
      <div
        className="animate-float-chip absolute -bottom-[16px] -right-[16px] flex items-center gap-[7px] bg-paper dark:bg-[#1A1C1E] border border-ink/10 dark:border-white/10 rounded-[11px] px-[13px] py-[9px] shadow-soft-hover"
        style={{ animationDelay: "-2.5s" }}
      >
        <BadgeCheck className="w-[14px] h-[14px] text-sel" strokeWidth={2} />
        <span className="text-[12px] font-semibold text-ink">Always free</span>
      </div>

      <Link
        href={card.href}
        className="absolute top-[52px] right-[14px] text-[11px] font-medium text-sel bg-paper/90 dark:bg-bg/90 backdrop-blur-sm px-[8px] py-[3px] rounded-full border border-sel/20 opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity"
      >
        Open tool →
      </Link>
    </div>
  );
}
