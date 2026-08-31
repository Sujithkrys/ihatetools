import { type ReactNode } from "react";

interface ToolWidgetShellProps {
  children?: ReactNode;
  title?: string;
}

export function ToolWidgetShell({ children, title }: ToolWidgetShellProps) {
  return (
    <div className="bg-surface border border-white/10 rounded-card p-6 md:p-8 w-full max-w-4xl mx-auto my-8">
      {title && (
        <h2 className="text-xl font-semibold text-textPrimary mb-6">
          {title}
        </h2>
      )}
      
      {children ? (
        children
      ) : (
        <div className="border-2 border-dashed border-white/20 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-background/50 h-[300px]">
          <p className="text-textSecondary text-lg font-medium">
            Tool interaction UI goes here
          </p>
          <p className="text-textMuted text-sm mt-2">
            Drag & drop files or interact with the specific tool components here.
          </p>
        </div>
      )}
    </div>
  );
}
