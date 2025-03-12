const fs = require('fs');
const path = require('path');

// Read trainers data from JSON
const trainersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public', 'data', 'trainers.json'), 'utf8')
);

// Configuration
const pagesDir = path.join(__dirname, 'public', 'pages');
const indexFile = path.join(__dirname, 'public', 'index.html');

// Extract trainers for a specific page by slug
function getTrainersForPage(slug) {
  const category = trainersData.categories.find(cat => cat.slug === slug);
  return category ? category.trainers : [];
}

// Generate HTML for trainers list
function generateTrainersHtml(trainers) {
  if (!trainers || trainers.length === 0) {
    return '<li><strong>Cvičitelé:</strong> Informace není k dispozici</li>';
  }

  let html = '<li><strong>Cvičitelé:</strong></li>\n';
  html += '          <ul class="trainers-list">\n';
  
  trainers.forEach(trainer => {
    html += '            <li>' + trainer.name;
    
    if (trainer.email || trainer.phone) {
      html += ' (';
      
      if (trainer.email) {
        html += `<a href="mailto:${trainer.email}">${trainer.email}</a>`;
      }
      
      if (trainer.email && trainer.phone) {
        html += ', ';
      }
      
      if (trainer.phone) {
        html += trainer.phone;
      }
      
      html += ')';
    }
    
    html += '</li>\n';
  });
  
  html += '          </ul>';
  return html;
}

// Process a page to add trainers information
function processPage(pageFile, isIndex = false) {
  const filePath = isIndex 
    ? indexFile 
    : path.join(pagesDir, pageFile);
  
  // Skip if file doesn't exist
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  console.log(`Processing: ${filePath}`);
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Get the page slug
  const slug = isIndex 
    ? 'index' 
    : pageFile.replace('.html', '');
  
  // Get trainers for this page
  const trainers = getTrainersForPage(slug);
  
  // Generate trainers HTML
  const trainersHtml = generateTrainersHtml(trainers);
  
  // Replace the "Cvičitel" section with our new trainers list
  // and remove the "Kontakt" line
  content = content.replace(
    /<li><strong>Cvičitel:<\/strong>.*?<\/li>(\s*<li><strong>Kontakt:<\/strong>.*?<\/li>)?/s,
    trainersHtml
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

// Process all HTML files in pages directory
function processAllPages() {
  // Process index.html
  processPage('index.html', true);
  
  // Process all other pages
  const files = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.html'));
  
  files.forEach(file => {
    processPage(file);
  });
  
  console.log('All pages updated successfully!');
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Run the script
processAllPages();