import { File as FileIcon, X, ArrowUp, ArrowDown } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FileListItemProps {
  file: File;
  index: number;
  totalFiles: number;
  onRemove: (index: number) => void;
  onMove?: (index: number, direction: 'up' | 'down') => void;
  showMoveControls?: boolean;
}

export function FileListItem({ 
  file, 
  index, 
  totalFiles, 
  onRemove, 
  onMove, 
  showMoveControls = false 
}: FileListItemProps) {
  return (
    <li className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
      <FileIcon className="w-8 h-8 text-textMuted shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-textPrimary truncate">{file.name}</p>
        <p className="text-xs text-textSecondary">{formatBytes(file.size)}</p>
      </div>
      
      <div className="flex items-center gap-1 shrink-0">
        {showMoveControls && onMove && (
          <>
            <button
              onClick={() => onMove(index, 'up')}
              disabled={index === 0}
              className="p-2 text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:hover:text-textMuted transition-colors rounded"
              aria-label="Move file up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onMove(index, 'down')}
              disabled={index === totalFiles - 1}
              className="p-2 text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:hover:text-textMuted transition-colors rounded"
              aria-label="Move file down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-textMuted hover:text-error transition-colors rounded ml-2"
          aria-label="Remove file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
}
