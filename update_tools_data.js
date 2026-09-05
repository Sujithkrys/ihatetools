const fs = require('fs');

let content = fs.readFileSync('src/lib/tools-data.ts', 'utf8');

content = content.replace(
  /export interface ToolData \{\n  id: string;\n  name: string;\n  description: string;\n  icon: LucideIcon;\n  href: string;\n  category: ToolCategory;\n\}/,
  `export interface ToolData {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
  beforeIcon?: LucideIcon;
  afterIcon?: LucideIcon;
  href: string;
  category: ToolCategory;
}`
);

const toolTransforms = {
  "merge-pdf": { before: "FileText", after: "FileText" },
  "split-pdf": { before: "FileText", after: "Files" },
  "compress-pdf": { before: "FileText", after: "Minimize2" },
  "compress-image": { before: "ImageIcon", after: "Minimize2" },
  "resize-image": { before: "ImageIcon", after: "Maximize" },
  "convert-image": { before: "ImageIcon", after: "FileUp" },
  "organize-pdf": { before: "FileText", after: "LayoutGrid" },
  "pdf-to-jpg": { before: "FileText", after: "FileImage" },
  "images-to-pdf": { before: "Files", after: "FileText" },
  "add-watermark": { before: "FileText", after: "Droplet" },
  "crop-image": { before: "ImageIcon", after: "Crop" },
  "qr-code-generator": { before: "ScanText", after: "QrCode" },
  "add-password": { before: "FileText", after: "Lock" },
  "remove-password": { before: "Lock", after: "Unlock" },
  "ocr-pdf": { before: "FileText", after: "ScanText" },
  "rotate-pdf": { before: "FileText", after: "RotateCw" },
  "delete-pdf-pages": { before: "FileText", after: "FileMinus" },
  "add-page-numbers": { before: "FileText", after: "FileDigit" },
  "pdf-metadata": { before: "FileText", after: "Tags" },
  "heic-to-jpg": { before: "ImageIcon", after: "ImagePlay" },
  "pdf-info": { before: "FileText", after: "Info" },
  "extract-pdf-text": { before: "FileText", after: "Type" },
  "extract-pdf-images": { before: "FileText", after: "ImageIcon" },
  "pdf-to-png": { before: "FileText", after: "ImagePlay" },
  "compress-image-target-size": { before: "ImageIcon", after: "Minimize2" },
  "rotate-image": { before: "ImageIcon", after: "RotateCw" },
  "flip-image": { before: "ImageIcon", after: "FlipHorizontal" },
  "grayscale-image": { before: "ImageIcon", after: "Paintbrush" },
  "round-image": { before: "ImageIcon", after: "Crop" },
  "add-text-to-image": { before: "ImageIcon", after: "Type" },
  "image-to-base64": { before: "ImageIcon", after: "Code2" },
  "base64-to-image": { before: "Code2", after: "ImageIcon" },
  "color-palette-extractor": { before: "ImageIcon", after: "Palette" },
  "favicon-generator": { before: "ImageIcon", after: "AppWindow" },
  "blur-image-region": { before: "ImageIcon", after: "EyeOff" }
};

for (const [id, transform] of Object.entries(toolTransforms)) {
  const regex = new RegExp("(\\{\\s*id:\\s*\"" + id + "\"[\\s\\S]*?)(icon:\\s*[a-zA-Z0-9]+,)");
  content = content.replace(regex, (match, p1, p2) => {
    return p1 + "beforeIcon: " + transform.before + ",\n    afterIcon: " + transform.after + ",";
  });
}

content = content.replace(/afterIcon: FileUp/g, "afterIcon: FileImage");

fs.writeFileSync('src/lib/tools-data.ts', content);
console.log('Tools data updated successfully.');
