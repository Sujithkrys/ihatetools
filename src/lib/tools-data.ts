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
  RotateCw,
  FileMinus,
  FileDigit,
  Tags,
  ImagePlay,
  Info,
  FlipHorizontal,
  Paintbrush,
  Type,
  Code2,
  Palette,
  AppWindow,
  EyeOff,
  Braces,
  CaseUpper,
  AlignLeft,
  Diff,
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
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate all pages in your PDF instantly.",
    icon: RotateCw,
    href: "/tools/rotate-pdf",
    category: "PDF Tools"
  },
  {
    id: "delete-pdf-pages",
    name: "Delete PDF Pages",
    description: "Remove unwanted pages from your document.",
    icon: FileMinus,
    href: "/tools/delete-pdf-pages",
    category: "PDF Tools"
  },
  {
    id: "add-page-numbers",
    name: "Add Page Numbers",
    description: "Easily add page numbers to your PDF documents.",
    icon: FileDigit,
    href: "/tools/add-page-numbers",
    category: "PDF Tools"
  },
  {
    id: "pdf-metadata",
    name: "Edit PDF Metadata",
    description: "View and edit PDF title, author, and properties.",
    icon: Tags,
    href: "/tools/pdf-metadata",
    category: "PDF Tools"
  },
  {
    id: "heic-to-jpg",
    name: "HEIC to JPG",
    description: "Convert Apple HEIC photos to standard JPG images.",
    icon: ImagePlay,
    href: "/tools/heic-to-jpg",
    category: "Image Tools"
  },
  {
    id: "pdf-info",
    name: "PDF Info Viewer",
    description: "View hidden metadata, page count, and PDF version.",
    icon: Info,
    href: "/tools/pdf-info",
    category: "PDF Tools"
  },
  {
    id: "extract-pdf-text",
    name: "Extract PDF Text",
    description: "Extract the embedded text from your PDF documents.",
    icon: FileText,
    href: "/tools/extract-pdf-text",
    category: "PDF Tools"
  },
  {
    id: "extract-pdf-images",
    name: "Extract PDF Images",
    description: "Extract embedded raw images directly from your PDFs.",
    icon: ImagePlay,
    href: "/tools/extract-pdf-images",
    category: "PDF Tools"
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description: "Convert PDF pages to lossless PNG images.",
    icon: ImagePlay,
    href: "/tools/pdf-to-png",
    category: "PDF Tools"
  },
  {
    id: "compress-image-target-size",
    name: "Target Size Compressor",
    description: "Compress your image to exactly fit a target file size in KB.",
    icon: Minimize2,
    href: "/tools/compress-image-target-size",
    category: "Image Tools"
  },
  {
    id: "rotate-image",
    name: "Rotate Image",
    description: "Rotate images 90 degrees or 180 degrees instantly.",
    icon: RotateCw,
    href: "/tools/rotate-image",
    category: "Image Tools"
  },
  {
    id: "flip-image",
    name: "Flip Image",
    description: "Mirror your photos horizontally or vertically.",
    icon: FlipHorizontal,
    href: "/tools/flip-image",
    category: "Image Tools"
  },
  {
    id: "grayscale-image",
    name: "Grayscale Image",
    description: "Convert photos to black and white or adjust grayscale intensity.",
    icon: Paintbrush,
    href: "/tools/grayscale-image",
    category: "Image Tools"
  },
  {
    id: "round-image",
    name: "Round Image",
    description: "Add rounded corners or circle crop to your images.",
    icon: Crop,
    href: "/tools/round-image",
    category: "Image Tools"
  },
  {
    id: "add-text-to-image",
    name: "Add Text to Image",
    description: "Easily add captions, text, and labels to your images.",
    icon: Type,
    href: "/tools/add-text-to-image",
    category: "Image Tools"
  },
  {
    id: "image-to-base64",
    name: "Image to Base64",
    description: "Convert any image into a Base64 data URI string.",
    icon: Code2,
    href: "/tools/image-to-base64",
    category: "Image Tools"
  },
  {
    id: "base64-to-image",
    name: "Base64 to Image",
    description: "Decode and render Base64 data strings into images.",
    icon: ImageIcon,
    href: "/tools/base64-to-image",
    category: "Image Tools"
  },
  {
    id: "color-palette-extractor",
    name: "Color Palette Extractor",
    description: "Extract the dominant colors from any image.",
    icon: Palette,
    href: "/tools/color-palette-extractor",
    category: "Image Tools"
  },
  {
    id: "favicon-generator",
    name: "Favicon Generator",
    description: "Generate a complete favicon package from your logo.",
    icon: AppWindow,
    href: "/tools/favicon-generator",
    category: "Image Tools"
  },
  {
    id: "blur-image-region",
    name: "Blur Image Region",
    description: "Redact or blur sensitive parts of your images.",
    icon: EyeOff,
    href: "/tools/blur-image-region",
    category: "Image Tools"
  },
  {
    id: "word-counter",
    name: "Word & Character Counter",
    description: "Live count of words, characters, and reading time.",
    icon: FileText,
    href: "/tools/word-counter",
    category: "Text Tools"
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON code securely.",
    icon: Braces,
    href: "/tools/json-formatter",
    category: "Text Tools"
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text to UPPERCASE, lowercase, camelCase, etc.",
    icon: CaseUpper,
    href: "/tools/case-converter",
    category: "Text Tools"
  },
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text instantly for your designs.",
    icon: AlignLeft,
    href: "/tools/lorem-ipsum-generator",
    category: "Text Tools"
  },
  {
    id: "text-diff",
    name: "Text Diff Checker",
    description: "Compare two text documents to spot differences.",
    icon: Diff,
    href: "/tools/text-diff",
    category: "Text Tools"
  }
];
