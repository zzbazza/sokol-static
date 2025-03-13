const fs = require('fs');
const path = require('path');

// Configuration for paths
const config = {
  rootDir: path.join(__dirname, 'public'),
  partialsDir: path.join(__dirname, 'public', 'partials'),
  pagesDir: path.join(__dirname, 'public', 'pages'),
  outputDir: path.join(__dirname, 'public', 'pages'),
  indexOutput: path.join(__dirname, 'public', 'index.html'),
};

// Helper function to read a partial
function readPartial(name) {
  return fs.readFileSync(path.join(config.partialsDir, `${name}.html`), 'utf8');
}

// Process a page
function processPage(pageFile, isIndex = false) {
  console.log(`Processing page: ${pageFile}`);

  // Determine input and output paths
  const inputPath = isIndex
    ? path.join(config.rootDir, pageFile)
    : path.join(config.pagesDir, pageFile);

  const outputPath = isIndex
    ? config.indexOutput
    : path.join(config.outputDir, pageFile);

  // Read the file content
  const content = fs.readFileSync(inputPath, 'utf8');

  // Extract the page content
  const contentMatch = content.match(/<div id="obsah">([\s\S]*?)<div class="sokol">/);
  if (!contentMatch) {
    console.error(`Could not extract content from ${pageFile}`);
    return;
  }

  // Get the page content
  let pageContent = contentMatch[1];

  // Get the page title
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  let pageTitle = titleMatch ? titleMatch[1].replace(' - TJ Sokol Stará Bělá', '') : 'TJ Sokol';
  if (pageTitle === 'TJ Sokol Stará Bělá') pageTitle = 'Hlavní strana';

  // Read partials
  let header = readPartial('header');
  let top = readPartial('top');
  let menu = readPartial('menu');
  let footer = readPartial('footer');

  // Set paths based on whether it's the index or a subpage
  const cssPath = isIndex ? 'css' : '../css';
  const jsPath = isIndex ? 'js' : '../js';
  const imgPath = isIndex ? 'images' : '../images';
  const rootPath = isIndex ? '' : '..';

  // Replace placeholders in partials
  header = header.replace('$CSS_PATH', cssPath)
                 .replace('$JS_PATH', jsPath)
                 .replace('$TITLE', pageTitle);

  top = top.replace(/\$ROOT_PATH/g, rootPath)
           .replace('$HOME_ACTIVE', pageFile === 'index.html' ? 'style="color: #89c224"' : '')
           .replace('$CONTACT_ACTIVE', pageFile === 'kontakt.html' ? 'style="color: #89c224"' : '')
           .replace('$ONAS_ACTIVE', pageFile === 'index.html' ? 'class="active"' : '')
           .replace('$ASPV_ACTIVE', pageFile === 'aspv.html' ? 'class="active"' : '')
           .replace('$TENIS_ACTIVE', pageFile === 'tenis.html' ? 'class="active"' : '')
           .replace('$VOLEJBAL_ACTIVE', pageFile === 'volejbal.html' ? 'class="active"' : '')
           .replace('$KCT_ACTIVE', pageFile === 'kct.html' ? 'class="active"' : '');

  // Define ASPV subpages
  const aspvSubpages = ['zacky.html', 'zaci.html', 'florbal.html', 'zeny.html', 'zeny2.html', 'muzi.html', 'aerobic.html', 'rodice.html'];
  const isAspvSubpage = aspvSubpages.includes(pageFile);
  
  // Check if in ASPV or subpage of ASPV
  const aspvActive = pageFile === 'aspv.html' || isAspvSubpage;
  
  menu = menu.replace(/\$IMG_PATH/g, imgPath)
             .replace(/\$ROOT_PATH/g, rootPath)
             .replace('$ONAS_ACTIVE', pageFile === 'index.html' ? 'class="active"' : '')
             .replace('$ASPV_ACTIVE', aspvActive ? 'class="active"' : '')
             .replace('$TENIS_ACTIVE', pageFile === 'tenis.html' ? 'class="active"' : '')
             .replace('$VOLEJBAL_ACTIVE', pageFile === 'volejbal.html' ? 'class="active"' : '')
             .replace('$KCT_ACTIVE', pageFile === 'kct.html' ? 'class="active"' : '')
             .replace('$ZACKY_ACTIVE', pageFile === 'zacky.html' ? 'style="color: #89c224"' : '')
             .replace('$ZACI_ACTIVE', pageFile === 'zaci.html' ? 'style="color: #89c224"' : '')
             .replace('$FLORBAL_ACTIVE', pageFile === 'florbal.html' ? 'style="color: #89c224"' : '')
             .replace('$ZENY_ACTIVE', pageFile === 'zeny.html' ? 'style="color: #89c224"' : '')
             .replace('$ZENY2_ACTIVE', pageFile === 'zeny2.html' ? 'style="color: #89c224"' : '')
             .replace('$MUZI_ACTIVE', pageFile === 'muzi.html' ? 'style="color: #89c224"' : '')
             .replace('$AEROBIC_ACTIVE', pageFile === 'aerobic.html' ? 'style="color: #89c224"' : '')
             .replace('$RODICE_ACTIVE', pageFile === 'rodice.html' ? 'style="color: #89c224"' : '');

  footer = footer.replace(/\$IMG_PATH/g, imgPath);

  // Combine everything into the final HTML
  const finalHtml = `${header}
${top}
${menu}

  <!-- Main Content Area -->
  <div id="obsah">${pageContent}<div class="sokol">`;

  // Add footer
  const fullHtml = finalHtml + footer.substring(footer.indexOf('<div class="sokol">') + 19);

  // Write the output file
  fs.writeFileSync(outputPath, fullHtml);
  console.log(`Generated: ${outputPath}`);
}

// Process all HTML files
function processAllPages() {
  // Process index.html
  processPage('index.html', true);

  // Get all HTML files in the pages directory
  const pageFiles = fs.readdirSync(config.pagesDir)
    .filter(file => file.endsWith('.html'));

  // Process each page
  pageFiles.forEach(pageFile => {
    processPage(pageFile);
  });

  console.log('All pages processed successfully!');
}

// Run the script
processAllPages();
