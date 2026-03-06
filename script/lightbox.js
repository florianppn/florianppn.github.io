"use strict";

/**
 * Lightbox : zoom sur les images des projets
 */
export function initLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox?.querySelector('.lightbox-backdrop');
    const zoomButtons = document.querySelectorAll('.works-card-image-zoom');

    if (!lightbox || !lightboxImage) return;

    function openLightbox(imgSrc, imgAlt) {
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt || 'Image agrandie';
        lightbox.classList.add('is-open');
        lightbox.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    zoomButtons.forEach((btn) => {
        const img = btn.querySelector('img');
        if (img) {
            btn.addEventListener('click', () => {
                openLightbox(img.src, img.alt);
            });
        }
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxBackdrop?.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
}
