const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(/rounded-\[32px\]/g, 'rounded-3xl');
  content = content.replace(/rounded-\[24px\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[20px\]/g, 'rounded-xl');
  content = content.replace(/rounded-\[16px\]/g, 'rounded-xl');
  
  // Convert any explicit px paddings/margins in the main container to standard tailwind
  // e.g. text-[20px] -> text-xl, text-[26px] -> text-2xl
  content = content.replace(/text-\[10px\]/g, 'text-xs');
  content = content.replace(/text-\[11px\]/g, 'text-xs');
  content = content.replace(/text-\[12px\]/g, 'text-xs');
  content = content.replace(/text-\[14px\]/g, 'text-sm');
  content = content.replace(/text-\[15px\]/g, 'text-base');
  content = content.replace(/text-\[16px\]/g, 'text-base');
  content = content.replace(/text-\[20px\]/g, 'text-xl');
  content = content.replace(/text-\[24px\]/g, 'text-2xl');
  content = content.replace(/text-\[26px\]/g, 'text-2xl');
  content = content.replace(/text-\[32px\]/g, 'text-3xl');
  content = content.replace(/text-\[36px\]/g, 'text-4xl');
  content = content.replace(/text-\[44px\]/g, 'text-5xl');

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
