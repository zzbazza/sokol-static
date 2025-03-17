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

  // Define ASPV subpages
  let aspvSubpages = ['zacky.html', 'zaci.html', 'zeny.html', 'muzi.html', 'aerobic.html', 'rodice.html', 'rozvrh.html', 'cykliste.html', 'turiste.html'];
  aspvSubpages = aspvSubpages.map(subpage => `aspv/${subpage}`);
  const isAspvSubpage = aspvSubpages.includes(pageFile);

  // Define Sokol subpages
  let sokolSubpages = ['stanovy.html', 'vybor.html', 'kalendar.html', 'historie.html'];
  sokolSubpages = sokolSubpages.map(subpage => `sokol/${subpage}`);
  const isSokolSubpage = sokolSubpages.includes(pageFile);

  // Check if in ASPV or subpage of ASPV
  const aspvActive = pageFile === 'aspv.html' || isAspvSubpage;
  const sokolActive = pageFile === 'index.html' || isSokolSubpage;

  menu = menu.replace(/\$IMG_PATH/g, imgPath)
    .replace(/\$ROOT_PATH/g, rootPath)
    .replace('$ONAS_ACTIVE', sokolActive ? 'class="active"' : '')
    .replaceAll('$ASPV_ACTIVE_CLASS', aspvActive ? 'active' : '')
    .replaceAll('$SOKOL_ACTIVE_CLASS', sokolActive ? 'active' : '')
    .replaceAll('$ASPV_ACTIVE', aspvActive ? 'class="active"' : '')
    .replace('$TENIS_ACTIVE', pageFile.includes('tenis.') ? 'class="active"' : '')
    .replace('$VOLEJBAL_ACTIVE', pageFile.includes('volejbal.') ? 'class="active"' : '')
    .replace('$HOKEJ_ACTIVE', pageFile.includes('hokej.') ? 'class="active"' : '')
    .replace('$KCT_ACTIVE', pageFile.includes('kct.') ? 'class="active"' : '')
    .replace('$ZACKY_ACTIVE', pageFile.includes('zacky.') ? 'class="active"' : '')
    .replace('$ZACI_ACTIVE', pageFile.includes('zaci.') ? 'class="active"' : '')
    .replace('$ZENY_ACTIVE', pageFile.includes('zeny.') ? 'class="active"' : '')
    .replace('$MUZI_ACTIVE', pageFile.includes('muzi.') ? 'class="active"' : '')
    .replace('$TURISTE_ACTIVE', pageFile.includes('turiste.') ? 'class="active"' : '')
    .replace('$CYKLISTE_ACTIVE', pageFile.includes('cykliste.') ? 'class="active"' : '')
    .replace('$AEROBIC_ACTIVE', pageFile.includes('aerobic.') ? 'class="active"' : '')
    .replace('$RODICE_ACTIVE', pageFile.includes('rodice.') ? 'class="active"' : '')
    .replace('$VYBOR_ACTIVE', pageFile.includes('vybor.') ? 'class="active"' : '')
    .replace('$STANOVY_ACTIVE', pageFile.includes('stanovy.') ? 'class="active"' : '')
    .replace('$KALENDAR_ACTIVE', pageFile.includes('kalendar.') ? 'class="active"' : '')
    .replace('$HISTORIE_ACTIVE', pageFile.includes('historie.') ? 'class="active"' : '');

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

// Helper function to read files recursively
function readFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readFilesRecursively(filePath, fileList);
    } else if (file.endsWith('.html')) {
      // Get relative path from pagesDir
      const relativePath = path.relative(config.pagesDir, filePath);
      fileList.push(relativePath);
    }
  });

  return fileList;
}

// Process all HTML files
function processAllPages() {
  // Process index.html
  processPage('index.html', true);

  // Get all HTML files in the pages directory and its subdirectories
  const pageFiles = readFilesRecursively(config.pagesDir);

  // Process each page
  pageFiles.forEach(pageFile => {
    processPage(pageFile);
  });

  console.log('All pages processed successfully!');
}

// Run the script
processAllPages();
