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
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

let replacedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace border-white/xx with border-overlay/xx
  content = content.replace(/border-white\/(\d+)/g, 'border-overlay/$1');
  // Replace bg-white/xx with bg-overlay/xx
  content = content.replace(/bg-white\/(\d+)/g, 'bg-overlay/$1');
  // Replace text-white/xx with text-overlay/xx
  content = content.replace(/text-white\/(\d+)/g, 'text-overlay/$1');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
  }
});

console.log(`Replaced hardcoded white utilities in ${replacedCount} files.`);
