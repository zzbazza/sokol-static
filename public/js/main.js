function redirectTo(url) {
    // Convert .html links to clean routes
    const cleanUrl = url.replace('.html', '');
    
    // Convert "index" to root URL "/"
    window.location.href = cleanUrl === 'index' ? '/' : cleanUrl;
}

// Keep backward compatibility with old code
function presmerujNa(odkaz) {
    redirectTo(odkaz);
}