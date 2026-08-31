import { Metadata } from "next";
import { 
  FileText, 
  SplitSquareHorizontal, 
  Minimize2, 
  Image as ImageIcon, 
  Maximize, 
  FileUp 
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "ihatetools - Free Online Tools",
  description: "Free, fast, client-side tools for developers and creators. No watermark, no sign-up required.",
};

const PDF_TOOLS = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into a single document instantly.",
    icon: FileText,
    href: "/tools/merge-pdf",
  },
  {
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple files.",
    icon: SplitSquareHorizontal,
    href: "/tools/split-pdf",
  },
  {
    name: "Compress PDF",
    description: "Reduce file size while maintaining visual quality.",
    icon: Minimize2,
    href: "/tools/compress-pdf",
  },
];

const IMAGE_TOOLS = [
  {
    name: "Image Compressor",
    description: "Shrink image file size without losing quality.",
    icon: ImageIcon,
    href: "/tools/compress-image",
  },
  {
    name: "Image Resizer",
    description: "Resize images to specific dimensions easily.",
    icon: Maximize,
    href: "/tools/resize-image",
  },
  {
    name: "Convert Image Format",
    description: "Convert between JPG, PNG, WEBP, and more.",
    icon: FileUp,
    href: "/tools/convert-image",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-24">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary leading-tight mb-6 tracking-tight">
          Free Online Tools. <br className="hidden md:block" />
          <span className="text-accent">No Watermark, No Sign-up Required.</span>
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          A collection of fast, private, client-side tools designed for developers and creators. Everything runs entirely in your browser.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="w-full max-w-content mx-auto px-4 space-y-16">
        <div>
          <h2 className="text-2xl font-semibold text-textPrimary mb-8">PDF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PDF_TOOLS.map((tool, i) => (
              <ToolCard key={i} {...tool} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-textPrimary mb-8">Image Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {IMAGE_TOOLS.map((tool, i) => (
              <ToolCard key={i} {...tool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
