const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace bg-white with bg-surface-container-lowest
  // Use regex to only match whole words
  content = content.replace(/\bbg-white\b/g, 'bg-surface-container-lowest');
  
  // Replace border border-[var(--color-primary)] with border border-[var(--color-primary)]/20
  // in dashboard pages to soften the borders
  if (filePath.includes('admin') || filePath.includes('campaigner') || filePath.includes('donor')) {
    content = content.replace(/border-\[var\(--color-primary\)\](?!\/)/g, 'border-[var(--color-primary)]/20');
    // also replace shadow-xl or shadow-sm with the nice shadow if it's the main container wrapper.
    // actually just replacing white and softening borders is enough for the inner cards.
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

traverse(path.join(__dirname, 'src'));
