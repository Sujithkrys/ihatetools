import { type ReactNode } from "react";
import { ToolPageChrome } from "./ToolPageChrome";

interface ToolWidgetShellProps {
  children?: ReactNode;
  title?: string;
  breadcrumbs?: string;
}

export function ToolWidgetShell({ children, title, breadcrumbs }: ToolWidgetShellProps) {
  return (
    <div className="border-[1.5px] border-ink rounded-[12px] bg-paper shadow-hard-lg overflow-hidden w-full max-w-4xl mx-auto my-8">
      {breadcrumbs && <ToolPageChrome breadcrumbs={breadcrumbs} />}
      
      <div className="p-6 md:p-8">
        {title && (
          <h2 className="disp text-xl mb-6 text-ink">
            {title}
          </h2>
        )}
        
        {children ? (
          children
        ) : (
          <div className="border-[2.5px] border-dashed border-ink rounded-[11px] p-12 flex flex-col items-center justify-center text-center bg-bg h-[300px]">
            <p className="text-grey text-lg font-medium">
              Tool interaction UI goes here
            </p>
            <p className="text-grey text-sm mt-2">
              Drag & drop files or interact with the specific tool components here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
