import React from 'react';

interface FrameProps {
  label?: string;
  labelColor?: "yellow" | "cyan" | "violet" | "pink" | "green";
  showDim?: boolean;
  dimText?: string;
  showBorder?: boolean;
  children: React.ReactNode;
}

export function Frame({ label, labelColor = "yellow", showBorder = true, children }: FrameProps) {
  const dotMap: Record<string, string> = {
    yellow: "bg-yellow",
    cyan: "bg-cyan",
    violet: "bg-violet",
    pink: "bg-pink",
    green: "bg-green",
  };

  if (!showBorder) {
    return (
      <section className="relative mb-[36px] md:mb-[56px]">
        {children}
      </section>
    );
  }

  return (
    <section className="relative mb-[36px] md:mb-[56px] py-[22px] px-[20px] md:py-[30px] md:px-[36px]">
      {label && (
        <span className="inline-flex items-center gap-[7px] mb-[16px] font-sans font-semibold text-[11px] uppercase tracking-[0.08em] text-grey">
          <span className={`w-[7px] h-[7px] rounded-full ${dotMap[labelColor]}`} />
          {label}
        </span>
      )}

      {children}
    </section>
  );
}
