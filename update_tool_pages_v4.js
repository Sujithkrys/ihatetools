const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'app', 'tools');


// Map tool slug to category for breadcrumbs

// We'll just parse the tools-data.ts manually
const toolsDataContent = fs.readFileSync(path.join(__dirname, 'src', 'lib', 'tools-data.ts'), 'utf8');

// Extract tool id -> category mapping
const toolCategoryMap = {};
const toolIdRegex = /id:\s*"([^"]+)"/g;
const toolCatRegex = /category:\s*"([^"]+)"/g;

let idMatch, catMatch;
const ids = [];
const cats = [];
while ((idMatch = toolIdRegex.exec(toolsDataContent)) !== null) {
  ids.push(idMatch[1]);
}
while ((catMatch = toolCatRegex.exec(toolsDataContent)) !== null) {
  cats.push(catMatch[1]);
}
for (let i = 0; i < ids.length; i++) {
  toolCategoryMap[ids[i]] = cats[i];
}

// Directories to skip (category pages + the main tools page)
const skipDirs = ['pdf', 'image', 'text'];

const entries = fs.readdirSync(toolsDir, { withFileTypes: true });
let updated = 0;
let skipped = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  if (skipDirs.includes(entry.name)) continue;
  
  const pagePath = path.join(toolsDir, entry.name, 'page.tsx');
  if (!fs.existsSync(pagePath)) continue;
  
  let content = fs.readFileSync(pagePath, 'utf8');
  const toolSlug = entry.name;
  const category = toolCategoryMap[toolSlug] || 'PDF Tools';
  
  // Determine breadcrumb path
  let catSlug = 'pdf';
  if (category === 'Image Tools') catSlug = 'image';
  else if (category === 'Text Tools') catSlug = 'text';
  
  const toolNameFromSlug = toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  // simplify: "merge-pdf" -> "merge"
  const shortName = toolSlug.replace(/-pdf|-image|-text/g, '').replace(/-/g, '-');
  const breadcrumbs = 'ihatetools / ' + catSlug + ' / ' + shortName;
  
  // Replace old styling patterns
  // 1. Replace header section styling
  content = content.replace(
    /className="flex flex-col items-center pt-16 pb-24 px-4"/g,
    'className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]"'
  );
  
  // 2. Replace h1 styling
  content = content.replace(
    /className="text-3xl md:text-4xl font-bold text-textPrimary mb-4 font-display"/g,
    'className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]"'
  );
  
  // 3. Replace subtitle styling
  content = content.replace(
    /className="text-textSecondary text-lg"/g,
    'className="text-grey text-[16px] tracking-[-0.015em]"'
  );
  
  // 4. Replace header section wrapper
  content = content.replace(
    /className="text-center max-w-2xl mx-auto mb-8"/g,
    'className="text-center max-w-2xl mx-auto mb-[24px]"'
  );
  
  // 5. Add breadcrumbs prop to ToolWidgetShell
  if (content.includes('<ToolWidgetShell>')) {
    content = content.replace(
      '<ToolWidgetShell>',
      '<ToolWidgetShell breadcrumbs="' + breadcrumbs + '">'
    );
  }
  
  fs.writeFileSync(pagePath, content);
  updated++;
  console.log('Updated: ' + toolSlug + ' (breadcrumbs: ' + breadcrumbs + ')');
}

console.log('\nDone! Updated ' + updated + ' tool pages.');
