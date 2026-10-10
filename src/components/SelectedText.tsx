import React from 'react';

interface SelectedTextProps {
  children: React.ReactNode;
  className?: string;
  showHandles?: boolean;
  as?: 'p' | 'span' | 'div';
}

export function SelectedText({ children, className = '', as = 'p' }: SelectedTextProps) {
  const Tag = as;
  return (
    <Tag className={`text-selected ${className}`}>
      {children}
    </Tag>
  );
}
