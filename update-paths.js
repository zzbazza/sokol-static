const fs = require('fs');
const path = require('path');

// Directory with HTML files to update
const pagesDir = path.join(__dirname, 'public', 'pages');
const indexFile = path.join(__dirname, 'public', 'index.html');

// Function to update paths in a file
function updatePaths(filePath) {
  console.log(`Updating paths in ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update paths in page files (not index.html)
  if (filePath !== indexFile) {
    // Update CSS paths
    content = content.replace(/href="css\//g, 'href="../css/');
    
    // Update JS paths
    content = content.replace(/src="js\//g, 'src="../js/');
    
    // Update image paths
    content = content.replace(/src="images\//g, 'src="../images/');
    content = content.replace(/href="images\//g, 'href="../images/');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// Process index.html
updatePaths(indexFile);

// Process all HTML files in pages directory
const files = fs.readdirSync(pagesDir);
files.forEach(file => {
  if (path.extname(file) === '.html') {
    updatePaths(path.join(pagesDir, file));
  }
});

console.log('All paths updated successfully.');