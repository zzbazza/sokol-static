const fs = require('fs');
const path = require('path');

// Get all HTML files in the public directory and subdirectories
function findHtmlFiles(directory) {
  const filesInDir = fs.readdirSync(directory);
  let htmlFiles = [];
  
  for (const file of filesInDir) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search for HTML files in subdirectories
      htmlFiles = htmlFiles.concat(findHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      htmlFiles.push(filePath);
    }
  }
  
  return htmlFiles;
}

const publicDir = path.join(__dirname, 'public');
const htmlFiles = findHtmlFiles(publicDir);

console.log(`Found ${htmlFiles.length} HTML files to update onclick handlers`);

// Process each HTML file
htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace presmerujNa with redirectTo in onclick handlers
  const updatedContent = content.replace(/onclick="presmerujNa\('([^']+)'\)"/g, (match, p1) => {
    return `onclick="redirectTo('${p1}')"`;
  });
  
  // Write the updated content back to the file
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated onclick handlers in ${path.relative(__dirname, filePath)}`);
  }
});

console.log('All onclick handlers updated successfully!');