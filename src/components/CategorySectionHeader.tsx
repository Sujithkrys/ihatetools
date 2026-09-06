'use client';

import React from 'react';
import { useHeadingStyle } from './HeadingStyleContext';

export type CategoryType = 'pdf' | 'image' | 'text';

interface CategoryStyleConfig {
  tagBg: string;
  tagTextColor: string;
  inkColor: string;
}

const CATEGORY_STYLES: Record<CategoryType, CategoryStyleConfig> = {
  pdf: {
    tagBg: 'bg-yellow',
    tagTextColor: 'text-[#111212]',
    inkColor: '#8B4E1F',
  },
  image: {
    tagBg: 'bg-cyan',
    tagTextColor: 'text-[#111212]',
    inkColor: '#1E4E72',
  },
  text: {
    tagBg: 'bg-violet',
    tagTextColor: 'text-[#111212]',
    inkColor: '#533A6B',
  },
};

interface CategorySectionHeaderProps {
  category: CategoryType;
  tag: string;
  title: string;
}

export function CategorySectionHeader({ category, tag, title }: CategorySectionHeaderProps) {
  const headingStyle = useHeadingStyle();
  const config = CATEGORY_STYLES[category];

  if (headingStyle === 'b') {
    // VERSION B: Inter weight 600, letter-spacing -0.03em, 36px, text-ink, no squiggle
    return (
      <div className="flex items-baseline gap-[14px] mb-[30px]">
        <span
          className={`tag font-sans font-semibold text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] ${config.tagBg} ${config.tagTextColor} select-none`}
        >
          {tag}
        </span>
        <h2 className="disp text-[36px] font-semibold tracking-[-0.03em] text-ink">
          {title}
        </h2>
      </div>
    );
  }

  // VERSION A (Default): Kalam weight 700, 42px, line-height 1.15, category ink tone, hand-drawn SVG squiggle underline
  return (
    <div className="flex items-baseline gap-[14px] mb-[30px]">
      <span
        className={`tag font-sans font-semibold text-[10px] uppercase tracking-[0.08em] px-[10px] py-[5px] border-[1.5px] border-ink rounded-[4px] ${config.tagBg} ${config.tagTextColor} select-none`}
      >
        {tag}
      </span>
      <div className="inline-flex flex-col">
        <h2
          className="font-kalam text-[42px] font-bold leading-[1.15] tracking-normal"
          style={{ color: config.inkColor }}
        >
          {title}
        </h2>
        <svg
          viewBox="0 0 240 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[9px] -mt-[2px]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 3 6 C 15 2, 25 2, 38 6 C 51 10, 61 10, 74 6 C 87 2, 97 2, 110 6 C 123 10, 133 10, 146 6 C 159 2, 169 2, 182 6 C 195 10, 205 10, 218 6 C 228 3, 235 4, 237 5"
            stroke={config.inkColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
