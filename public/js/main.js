// import lightGallery from 'lightgallery';

// Plugins
// import lgThumbnail from 'lightgallery/plugins/thumbnail'
// import lgZoom from 'lightgallery/plugins/zoom'

document.addEventListener('DOMContentLoaded', function () {
  console.dir(document.getElementById('lightgallery'))
  lightGallery(document.getElementById('lightgallery'), {
    autoplayFirstVideo: false,
    pager: false,
    galleryId: "nature",
    plugins: [lgZoom, lgThumbnail],
    mobileSettings: {
      controls: false,
      showCloseIcon: false,
      download: false,
      rotate: false
    }
  });
});
