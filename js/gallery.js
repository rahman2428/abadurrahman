// gallery.js
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Collect images
  const imgNodes = Array.from(document.querySelectorAll('.zoom img'));
  const lb = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbPath = document.getElementById('lbPath');
  const lbIndex = document.getElementById('lbIndex');
  const lbDownload = document.getElementById('lbDownload');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbClose = document.getElementById('lbClose');

  let current = 0;

  function openLightbox(index) {
    current = index;
    const img = imgNodes[current];
    lbImage.src = img.src;
    lbImage.alt = img.alt || '';
    lbCaption.textContent = img.alt || '';
    lbPath.textContent = img.src;
    lbIndex.textContent = (current + 1) + ' / ' + imgNodes.length;
    lbDownload.href = img.src;
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus for keyboard nav
    lbClose.focus();
  }

  function closeLightbox() {
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImage.src = '';
  }

  function prevImage() {
    current = (current - 1 + imgNodes.length) % imgNodes.length;
    openLightbox(current);
  }
  function nextImage() {
    current = (current + 1) % imgNodes.length;
    openLightbox(current);
  }

  // click handlers to open
  imgNodes.forEach((imgEl, idx) => {
    imgEl.addEventListener('click', () => openLightbox(idx));
    // allow keyboard open on Enter/Space when focused on zoom container
    imgEl.parentElement.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openLightbox(idx);
      }
    });
  });

  // close by clicking backdrop
  lb.addEventListener('click', (ev) => {
    if (ev.target === lb) closeLightbox();
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  // keyboard nav: Esc to close, arrows for next/prev
  document.addEventListener('keydown', (ev) => {
    if (lb.getAttribute('aria-hidden') === 'false') {
      if (ev.key === 'Escape') closeLightbox();
      if (ev.key === 'ArrowLeft') prevImage();
      if (ev.key === 'ArrowRight') nextImage();
    }
  });

  // Preload neighbor images for smoother navigation
  function preload(idx) {
    if (!imgNodes[idx]) return;
    const p = new Image();
    p.src = imgNodes[idx].src;
  }
  // Preload on open
  const origOpen = openLightbox;
  openLightbox = function(index) {
    current = index;
    const img = imgNodes[current];
    lbImage.src = img.src;
    lbImage.alt = img.alt || '';
    lbCaption.textContent = img.alt || '';
    
    lbIndex.textContent = (current + 1) + ' / ' + imgNodes.length;
    lbDownload.href = img.src;
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
    // preload neighbors
    preload((current + 1) % imgNodes.length);
    preload((current - 1 + imgNodes.length) % imgNodes.length);
  };

menuBtn?.addEventListener("click", () => {
  const nav = document.querySelector(".nav");
  nav.style.display = nav.style.display === "flex" ? "" : "flex";
  nav.style.flexDirection = "column";
});
