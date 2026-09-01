import { 
  FileText, 
  SplitSquareHorizontal, 
  Minimize2, 
  Image as ImageIcon, 
  Maximize, 
  FileUp,
  LucideIcon
} from "lucide-react";

export type ToolCategory = "PDF Tools" | "Image Tools";

export interface ToolData {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: ToolCategory;
}

export const TOOLS: ToolData[] = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDFs into a single document instantly.",
    icon: FileText,
    href: "/tools/merge-pdf",
    category: "PDF Tools"
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple files.",
    icon: SplitSquareHorizontal,
    href: "/tools/split-pdf",
    category: "PDF Tools"
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce file size while maintaining visual quality.",
    icon: Minimize2,
    href: "/tools/compress-pdf",
    category: "PDF Tools"
  },
  {
    id: "compress-image",
    name: "Image Compressor",
    description: "Shrink image file size without losing quality.",
    icon: ImageIcon,
    href: "/tools/compress-image",
    category: "Image Tools"
  },
  {
    id: "resize-image",
    name: "Image Resizer",
    description: "Resize images to specific dimensions easily.",
    icon: Maximize,
    href: "/tools/resize-image",
    category: "Image Tools"
  },
  {
    id: "convert-image",
    name: "Convert Image Format",
    description: "Convert between JPG, PNG, WEBP, and more.",
    icon: FileUp,
    href: "/tools/convert-image",
    category: "Image Tools"
  }
];
