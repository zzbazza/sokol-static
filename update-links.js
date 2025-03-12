const fs = require('fs');
const path = require('path');

// Get all HTML files in the directory
const htmlFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files to update`);

// Process each HTML file
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all internal links in href attributes that end with .html
  const updatedContent = content.replace(/href="([^"]+\.html)"/g, (match, p1) => {
    return `href="${p1.replace('.html', '')}"`;
  });
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Updated links in ${file}`);
});

console.log('All links updated successfully!');