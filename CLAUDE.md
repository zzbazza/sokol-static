# Sokol Web - Static Site Development Guidelines

## Project Structure
- `/public`: Contains production-ready files served by Express
  - `/pages`: HTML pages for each section of the site
  - `/partials`: Reusable HTML components (header, menu, footer)
  - `/css`: Stylesheet files
  - `/js`: JavaScript files
  - `/images`: Image assets
  - `/data`: JSON data files (like trainers.json)
- `/src`: Source files (for future development)

## Commands
- **Start server**: `npm start` (runs `node server.js`)
- **Development mode**: `npm run dev` (runs `nodemon server.js` with auto-reload)
- **Build HTML**: `npm run build-html` (rebuilds HTML files using partials)
- **Update paths**: `npm run update-paths` (fixes file references in HTML)
- **Update trainers**: `npm run update-trainers` (updates trainer info from JSON data)
- **Install dependencies**: `npm install`

## Code Style Guidelines
- **Language**: JavaScript with Node.js/Express for backend
- **Frontend**: Static HTML with CSS styling
- **Naming**: 
  - Use camelCase for JavaScript variables/functions
  - HTML files: Descriptive Czech names, lowercase (e.g., zeny.html)
  - CSS: Use classes with meaningful names
- **Express Routes**: Clean URLs without .html extension
- **Indentation**: Use 2 spaces
- **Error handling**: Log errors to console
- **Content**: Primarily in Czech language