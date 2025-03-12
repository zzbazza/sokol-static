const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for each HTML page
const routes = {
  '/': 'index.html',
  '/aerobic': 'pages/aerobic.html',
  '/dorost': 'pages/dorost.html',
  '/kontakt': 'pages/kontakt.html',
  '/muzi': 'pages/muzi.html',
  '/rodice': 'pages/rodice.html',
  '/rozvrh': 'pages/rozvrh.html',
  '/zaci': 'pages/zaci.html', 
  '/zacky': 'pages/zacky.html',
  '/zeny': 'pages/zeny.html',
  '/zeny2': 'pages/zeny2.html'
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