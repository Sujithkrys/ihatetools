import React from 'react';
import { CornerHandles } from './CornerHandles';

interface SelectedTextProps {
  children: React.ReactNode;
  className?: string;
  showHandles?: boolean;
  as?: 'p' | 'span' | 'div';
}

export function SelectedText({ children, className = '', showHandles = true, as = 'p' }: SelectedTextProps) {
  const Tag = as;
  return (
    <Tag className={`text-selected ${className}`}>
      {showHandles && <CornerHandles size={6} />}
      {children}
    </Tag>
  );
}
