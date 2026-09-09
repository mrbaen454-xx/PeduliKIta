const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Don't touch Navbar or Footer to keep hamburger and normal mobile footer
  if (filePath.includes('Navbar.jsx')) return;

  // Replace stacking grid classes
  content = content.replace(/grid-cols-1 md:grid-cols-2 lg:grid-cols-3/g, 'grid-cols-3');
  content = content.replace(/grid-cols-1 md:grid-cols-3/g, 'grid-cols-3');
  content = content.replace(/grid-cols-1 md:grid-cols-2/g, 'grid-cols-2');
  content = content.replace(/grid md:grid-cols-3/g, 'grid grid-cols-3');
  content = content.replace(/grid md:grid-cols-2/g, 'grid grid-cols-2');

  // Replace stacking flex classes
  content = content.replace(/flex-col md:flex-row/g, 'flex-row');
  content = content.replace(/flex-col lg:flex-row/g, 'flex-row');
  content = content.replace(/flex-col-reverse lg:flex-row/g, 'flex-row');
  
  // Unhide hidden columns in auth pages
  if (filePath.includes('Login.jsx') || filePath.includes('Register.jsx')) {
    content = content.replace(/hidden lg:flex lg:w-1\/2/g, 'flex w-1/2');
    content = content.replace(/w-full lg:w-1\/2/g, 'w-1/2');
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
