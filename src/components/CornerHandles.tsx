import React from 'react';

interface CornerHandlesProps {
  size?: number;
}

export function CornerHandles({ size = 8 }: CornerHandlesProps) {
  const s = `${size}px`;
  const o = `-${size / 2}px`;

  return (
    <>
      <i className="absolute bg-paper border-[1.5px] border-sel" style={{ width: s, height: s, top: o, left: o }} />
      <i className="absolute bg-paper border-[1.5px] border-sel" style={{ width: s, height: s, top: o, right: o }} />
      <i className="absolute bg-paper border-[1.5px] border-sel" style={{ width: s, height: s, bottom: o, left: o }} />
      <i className="absolute bg-paper border-[1.5px] border-sel" style={{ width: s, height: s, bottom: o, right: o }} />
    </>
  );
}
