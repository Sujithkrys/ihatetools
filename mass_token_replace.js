const fs = require('fs');
const path = require('path');

function walkDir(dir, ext) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(fullPath, ext));
    } else if (fullPath.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcDir = path.join(__dirname, 'src');
const files = walkDir(srcDir, '.tsx');

// Replacement map: old token -> new token
const replacements = [
  // Color classes
  ['text-textPrimary', 'text-ink'],
  ['text-textSecondary', 'text-grey'],
  ['text-textMuted', 'text-grey/60'],
  ['bg-background', 'bg-bg'],
  ['bg-surface', 'bg-paper'],
  ['bg-surfaceHover', 'bg-bg'],
  ['hover:bg-surfaceHover', 'hover:bg-bg'],
  ['border-overlay/5', 'border-ink/10'],
  ['border-overlay/10', 'border-ink/15'],
  ['border-overlay/20', 'border-ink/25'],
  ['bg-overlay/5', 'bg-ink/5'],
  ['hover:bg-overlay/5', 'hover:bg-ink/5'],
  ['text-overlay/30', 'text-ink/30'],
  ['bg-background/50', 'bg-bg/50'],
  ['border-overlay', 'border-ink'],
  ['text-accent', 'text-yellow'],
  ['bg-accent', 'bg-yellow'],
  ['hover:text-accent', 'hover:text-yellow'],
  ['focus:ring-accent', 'focus:ring-sel'],
  ['focus:border-accent', 'focus:border-sel'],
  ['text-accentSecondary', 'text-cyan'],
  ['text-accentTertiary', 'text-violet'],
  ['bg-accentSecondary', 'bg-cyan'],
  ['bg-accentTertiary', 'bg-violet'],
  // Typography classes
  ['font-display', 'font-sans'],
  ['rounded-card', 'rounded-[11px]'],
  ['rounded-button', 'rounded-[8px]'],
  // Shadow patterns
  ['shadow-lg', 'shadow-hard'],
  ['shadow-md', 'shadow-hard-sm'],
];

let totalUpdated = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      // Use global string replacement
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      content = content.replace(regex, to);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    totalUpdated++;
    console.log('Updated: ' + path.relative(srcDir, file));
  }
}

console.log('\nDone! Updated ' + totalUpdated + ' files.');
