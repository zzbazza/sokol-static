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

// Show/hide tabmenu based on active menu item
document.addEventListener('DOMContentLoaded', function() {
    // Check if ASPV or any of its subitems are active
    const isAspvActive = document.querySelector('#top-nav a[href*="aspv"].active') !== null;
    const isAspvSubitemActive = document.querySelector('#tabmenu a.active') !== null;
    
    // Show tabmenu only if ASPV or its subitems are active
    const tabmenu = document.getElementById('tabmenu');
    if (tabmenu) {
        tabmenu.style.display = (isAspvActive || isAspvSubitemActive) ? 'table' : 'none';
    }
});