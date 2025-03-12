# Sokol Static Website

A simple Node.js Express server for the TJ Sokol Stará Bělá website.

## Project Structure

```
sokol-static/
├── public/              # Static files served by Express
│   ├── pages/           # HTML pages
│   ├── partials/        # Reusable HTML components (header, menu, footer)
│   ├── css/             # CSS stylesheets
│   ├── js/              # JavaScript files
│   ├── images/          # Image assets
│   ├── data/            # JSON data files
│   └── index.html       # Homepage
├── src/                 # Source files for development
├── server.js            # Express server configuration
├── build-html.js        # Script to build HTML pages from partials
├── update-paths.js      # Utility to update file paths in HTML
├── update-trainers.js   # Script to update trainer information 
├── trainers_list.txt    # Source data for trainers
└── package.json         # Project configuration
```

## Development

### Prerequisites

- Node.js (v14 or newer)
- npm

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

This will start a development server with auto-reload at http://localhost:3000.

### Production Server

```bash
npm start
```

### File Structure

- All HTML pages are in the `public/pages/` directory, except for `index.html` which is in the root
- CSS styles are in `public/css/`
- JavaScript files are in `public/js/`
- Images are in `public/images/`

### Routes

The website uses clean URLs without .html extensions:

- `/` - Homepage
- `/zeny` - Women's section
- `/muzi` - Men's section
- etc.

## Maintenance

### Update Paths in HTML Files

To update paths in HTML files after moving files:

```bash
npm run update-paths
```

### Working with Partials

The website uses a partials system to maintain consistency across pages. The main partials are:

- `header.html` - Contains DOCTYPE, head section, and opening body tag
- `top.html` - Contains the logo and top navigation
- `menu.html` - Contains the main menu with images
- `footer.html` - Contains the footer with sponsors and closing tags

To modify a common element that appears on all pages, edit the appropriate partial file in `public/partials/`.

After modifying partials, rebuild all HTML files:

```bash
npm run build-html
```

This will extract the main content from each page and combine it with the updated partials.

### Working with Trainer Data

The website uses a JSON-based system to manage trainer information across pages:

1. Trainer data is stored in `public/data/trainers.json`
2. Each activity category has an array of trainers with contact information
3. To update trainer information:
   - Edit the JSON file or the source `trainers_list.txt` file
   - Run `npm run update-trainers` to apply changes to all pages

The script automatically:
- Changes "Cvičitel" to "Cvičitelé" on all pages
- Lists all trainers for each category with their contact information
- Removes generic "Kontakt" information and uses trainer-specific contacts