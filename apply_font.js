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
      if (file.endsWith('page.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src/app'));

let replacedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Apply font-display to h1
  content = content.replace(/<h1 className="([^"]*?font-bold[^"]*?)"/g, (match, classes) => {
    if (!classes.includes('font-display')) {
      return `<h1 className="${classes} font-display"`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
  }
});

console.log(`Applied font-display to h1s in ${replacedCount} files.`);
