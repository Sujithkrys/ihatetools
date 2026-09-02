import { 
  FileText, 
  SplitSquareHorizontal, 
  Minimize2, 
  Image as ImageIcon, 
  Maximize, 
  FileUp,
  LayoutGrid,
  FileImage,
  Files,
  Droplet,
  Crop,
  QrCode,
  Lock,
  Unlock,
  ScanText,
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
  },
  {
    id: "organize-pdf",
    name: "Organize PDF",
    description: "Reorder, rotate, and delete PDF pages easily.",
    icon: LayoutGrid,
    href: "/tools/organize-pdf",
    category: "PDF Tools"
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert each page of a PDF into a JPG image.",
    icon: FileImage,
    href: "/tools/pdf-to-jpg",
    category: "PDF Tools"
  },
  {
    id: "images-to-pdf",
    name: "Images to PDF",
    description: "Combine multiple images into a single PDF document.",
    icon: Files,
    href: "/tools/images-to-pdf",
    category: "PDF Tools"
  },
  {
    id: "add-watermark",
    name: "Add Watermark",
    description: "Stamp text onto your PDF pages.",
    icon: Droplet,
    href: "/tools/add-watermark",
    category: "PDF Tools"
  },
  {
    id: "crop-image",
    name: "Image Crop",
    description: "Crop and extract a specific region from an image.",
    icon: Crop,
    href: "/tools/crop-image",
    category: "Image Tools"
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate a custom QR code from text or URLs.",
    icon: QrCode,
    href: "/tools/qr-code-generator",
    category: "Image Tools"
  },
  {
    id: "add-password",
    name: "Protect PDF",
    description: "Add a password to your PDF file securely.",
    icon: Lock,
    href: "/tools/add-password",
    category: "PDF Tools"
  },
  {
    id: "remove-password",
    name: "Unlock PDF",
    description: "Remove the password from a protected PDF.",
    icon: Unlock,
    href: "/tools/remove-password",
    category: "PDF Tools"
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    description: "Extract text from scanned PDFs or images using OCR.",
    icon: ScanText,
    href: "/tools/ocr-pdf",
    category: "PDF Tools"
  }
];
