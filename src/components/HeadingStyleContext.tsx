'use client';

import React, { createContext, useContext, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export type HeadingStyle = 'a' | 'b';

const HeadingStyleContext = createContext<HeadingStyle>('a');

function HeadingStyleConsumer({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const headingStyleParam = searchParams.get('heading-style');
  const style: HeadingStyle = headingStyleParam === 'b' ? 'b' : 'a';

  return (
    <HeadingStyleContext.Provider value={style}>
      {children}
    </HeadingStyleContext.Provider>
  );
}

export function HeadingStyleProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<HeadingStyleContext.Provider value="a">{children}</HeadingStyleContext.Provider>}>
      <HeadingStyleConsumer>{children}</HeadingStyleConsumer>
    </Suspense>
  );
}

export function useHeadingStyle(): HeadingStyle {
  return useContext(HeadingStyleContext);
}
