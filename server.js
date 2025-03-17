const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve Font Awesome files
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Define routes for each HTML page
const routes = {
  '/': 'index.html',
  '/aspv/aerobic': 'pages/aspv/aerobic.html',
  '/aspv/muzi': 'pages/aspv/muzi.html',
  '/aspv/rodice': 'pages/aspv/rodice.html',
  '/aspv/rozvrh': 'pages/aspv/rozvrh.html',
  '/aspv/zaci': 'pages/aspv/zaci.html',
  '/aspv/zacky': 'pages/aspv/zacky.html',
  '/aspv/zeny': 'pages/aspv/zeny.html',
  '/aspv/cykliste': 'pages/aspv/cykliste.html',
  '/aspv/turiste': 'pages/aspv/turiste.html',
  '/aspv': 'pages/aspv.html',
  '/tenis': 'pages/tenis.html',
  '/volejbal': 'pages/volejbal.html',
  '/hokej': 'pages/hokej.html',
  '/kct': 'pages/kct.html',
  '/sokol/stanovy': 'pages/sokol/stanovy.html',
  '/sokol/vybor': 'pages/sokol/vybor.html',
  '/sokol/kalendar': 'pages/sokol/kalendar.html',
  '/sokol/historie': 'pages/sokol/historie.html',
};

// Set up route handlers
Object.entries(routes).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', file));
  });
});

// Redirect /index to /
app.get('/index', (req, res) => {
  res.redirect(301, '/');
});

// Handle old .html routes - redirect to clean URLs
Object.entries(routes).forEach(([route, file]) => {
  if (file === 'index.html') return; // Skip index.html

  app.get(`/${file}`, (req, res) => {
    // Redirect from old .html URL to clean URL
    const cleanUrl = route;
    res.redirect(301, cleanUrl);
  });
});

// Fallback route for any undefined routes - show 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  Object.keys(routes).forEach(route => {
    console.log(`  ${route}`);
  });
});
