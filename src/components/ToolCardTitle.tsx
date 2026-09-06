'use client';

import React from 'react';
import { useHeadingStyle } from './HeadingStyleContext';

export function ToolCardTitle({ name }: { name: string }) {
  const headingStyle = useHeadingStyle();

  if (headingStyle === 'b') {
    return (
      <h3 className="font-kalam text-[17px] font-bold mb-[7px] text-ink leading-snug">
        {name}
      </h3>
    );
  }

  return (
    <h3 className="disp text-[19px] mb-[7px] text-ink font-medium tracking-[-0.02em]">
      {name}
    </h3>
  );
}
