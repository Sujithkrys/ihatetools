const fs = require('fs');

let content = fs.readFileSync('src/lib/tools-data.ts', 'utf8');

content = content.replace(
  /export interface ToolData \{\n  id: string;\n  name: string;\n  description: string;\n  icon\?: LucideIcon;\n  beforeIcon\?: LucideIcon;\n  afterIcon\?: LucideIcon;\n  href: string;\n  category: ToolCategory;\n\}/,
  "export interface ToolData {\n  id: string;\n  name: string;\n  description: string;\n  beforeText?: string;\n  afterText?: string | string[];\n  isStacked?: boolean;\n  arrowText?: string;\n  href: string;\n  category: ToolCategory;\n}"
);

const toolMapping = {
  "merge-pdf": { before: '"PDF"', isStacked: true, arrow: '"→"', after: '"PDF"' },
  "split-pdf": { before: '"PDF"', arrow: '"→"', after: '["1", "2"]' },
  "compress-pdf": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "compress-image": { before: '"JPG"', arrow: '"→"', after: '"JPG"' },
  "resize-image": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  "convert-image": { before: '"PNG"', arrow: '"→"', after: '"WEBP"' },
  "organize-pdf": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "pdf-to-jpg": { before: '"PDF"', arrow: '"→"', after: '"JPG"' },
  "images-to-pdf": { before: '"JPG"', isStacked: true, arrow: '"→"', after: '"PDF"' },
  "add-watermark": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "crop-image": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  "qr-code-generator": { before: '"URL"', arrow: '"→"', after: '"QR"' },
  "add-password": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "remove-password": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "ocr-pdf": { before: '"PDF"', arrow: '"→"', after: '"TXT"' },
  "rotate-pdf": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "delete-pdf-pages": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "add-page-numbers": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "pdf-metadata": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "heic-to-jpg": { before: '"HEIC"', arrow: '"→"', after: '"JPG"' },
  "pdf-info": { before: '"PDF"', arrow: '"→"', after: '"PDF"' },
  "extract-pdf-text": { before: '"PDF"', arrow: '"→"', after: '"TXT"' },
  "extract-pdf-images": { before: '"PDF"', arrow: '"→"', after: '"IMG"' },
  "pdf-to-png": { before: '"PDF"', arrow: '"→"', after: '"PNG"' },
  "compress-image-target-size": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  "rotate-image": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  "flip-image": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  "grayscale-image": { before: '"IMG"', arrow: '"→"', after: '"B&W"' },
  "round-image": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  "add-text-to-image": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  "image-to-base64": { before: '"IMG"', arrow: '"→"', after: '"B64"' },
  "base64-to-image": { before: '"B64"', arrow: '"→"', after: '"IMG"' },
  "color-palette-extractor": { before: '"IMG"', arrow: '"→"', after: '"PAL"' },
  "favicon-generator": { before: '"IMG"', arrow: '"→"', after: '"ICO"' },
  "blur-image-region": { before: '"IMG"', arrow: '"→"', after: '"IMG"' },
  
  "word-counter": { before: '"Aa"' },
  "json-formatter": { before: '"{ }"' },
  "case-converter": { before: '"Aa"' },
  "lorem-ipsum-generator": { before: '"Ab"' },
  "text-diff": { before: '"±"' }
};

for (const [id, transform] of Object.entries(toolMapping)) {
  const regex = new RegExp("(\\{\\s*id:\\s*\"" + id + "\"[\\s\\S]*?description:\\s*\"[^\"]*\",)(?:\\s*beforeIcon:[^,]+,|\\s*afterIcon:[^,]+,|\\s*icon:[^,]+,)*", "g");
  
  content = content.replace(regex, (match, p1) => {
    let newFields = "\n    beforeText: " + transform.before + ",";
    if (transform.after) {
      let afterVal = typeof transform.after === 'string' ? transform.after : JSON.stringify(transform.after);
      newFields += "\n    afterText: " + afterVal + ",";
    }
    if (transform.isStacked) {
      newFields += "\n    isStacked: true,";
    }
    if (transform.arrow) {
      newFields += "\n    arrowText: " + transform.arrow + ",";
    }
    return p1 + newFields;
  });
}

content = content.replace(/import\s+\{[\s\S]*?\}\s+from\s+"lucide-react";\n\n/, '');
content = content.replace(/icon\?: LucideIcon;\n  /g, '');
content = content.replace(/beforeIcon\?: LucideIcon;\n  /g, '');
content = content.replace(/afterIcon\?: LucideIcon;\n  /g, '');

fs.writeFileSync('src/lib/tools-data.ts', content);
console.log('Tools data updated to v4 data model.');
