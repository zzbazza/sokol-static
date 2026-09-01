// import lightGallery from 'lightgallery';

// Plugins
// import lgThumbnail from 'lightgallery/plugins/thumbnail'
// import lgZoom from 'lightgallery/plugins/zoom'

document.addEventListener('DOMContentLoaded', function () {
  var gallery = document.getElementById('lightgallery');
  if (!gallery) return;
  lightGallery(gallery, {
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

/* ---------------------------------------------------------------
   Modal - malé okno pro detail zprávy nebo akce v kalendáři.

   Použití v HTML (bez psaní JS):
     <a href="#" data-modal-title="Sokolský ples"
        data-modal="Začátek v 19:00 v sokolovně.">31.1.2026 - Sokolský ples</a>

   Delší obsah se dá připravit ve skryté šabloně:
     <a href="#" data-modal-title="Ples" data-modal-target="#ples-detail">...</a>
     <template id="ples-detail"><p>Libovolné <strong>HTML</strong>.</p></template>

   Použití z JS:
     openModal('Nadpis', 'Text');
     openModal({ title: 'Nadpis', html: '<p>HTML obsah</p>' });
     closeModal();
   --------------------------------------------------------------- */
(function () {
  var overlay = null;
  var titleEl = null;
  var bodyEl = null;
  var closeBtn = null;
  var lastFocused = null;

  function build() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '  <button type="button" class="modal-close" aria-label="Zavřít">' +
      '    <i class="fa-solid fa-xmark"></i>' +
      '  </button>' +
      '  <h3 class="modal-title" id="modal-title"></h3>' +
      '  <div class="modal-body"></div>' +
      '</div>';

    titleEl = overlay.querySelector('.modal-title');
    bodyEl = overlay.querySelector('.modal-body');
    closeBtn = overlay.querySelector('.modal-close');

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.body.appendChild(overlay);
  }

  function openModal(title, content) {
    var opts = (title && typeof title === 'object') ? title : { title: title, text: content };
    build();

    titleEl.textContent = opts.title || '';
    titleEl.style.display = opts.title ? '' : 'none';

    if (opts.html) {
      bodyEl.innerHTML = opts.html;
    } else {
      bodyEl.textContent = opts.text || '';
    }

    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeBtn.focus();
  }

  function closeModal() {
    if (!overlay || !overlay.classList.contains('is-open')) return;

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    bodyEl.innerHTML = '';

    if (lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Odkazy s data-modal / data-modal-target otevřou okno samy.
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;

    var trigger = e.target.closest('[data-modal], [data-modal-target]');
    if (!trigger) return;

    e.preventDefault();

    var target = trigger.getAttribute('data-modal-target');
    var source = target ? document.querySelector(target) : null;

    openModal({
      title: trigger.getAttribute('data-modal-title') || trigger.textContent.trim(),
      text: target ? null : trigger.getAttribute('data-modal'),
      html: source ? (source.innerHTML || '') : null
    });
  });

  window.openModal = openModal;
  window.closeModal = closeModal;
})();
