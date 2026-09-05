const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src/components'));

let replacedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Look for the typical result wrapper after a file is selected:
  // e.g. `{file && (` followed by `<div className="bg-surface...`
  // We'll replace it with `animate-reveal-result` included.
  content = content.replace(/({\s*(?:file|files\.length > 0|processedFiles\.length > 0)\s*&&\s*\(\s*<div\s+className="[^"]*?)(bg-surface)/g, '$1animate-reveal-result $2');
  
  // Also apply tool-interaction-zone to drag and drop areas (border-dashed)
  content = content.replace(/(className="[^"]*?border-dashed[^"]*?)"/g, (match, p1) => {
    if (!p1.includes('tool-interaction-zone')) {
      return p1 + ' tool-interaction-zone"';
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
  }
});

console.log(`Applied animations and custom cursor in ${replacedCount} files.`);
