"use strict";

/**
 * Initialise la lightbox pour les images des projets.
 * Gère l'ouverture/fermeture, le piège au focus (clavier), le retour du focus et la fermeture à Échap.
 * @returns {void}
 */
export function initLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox?.querySelector('.lightbox-backdrop');
    const zoomButtons = document.querySelectorAll('.works-card-image-zoom');
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    if (!lightbox || !lightboxImage) return;

    let previousActiveElement = null;

    function getFocusables() {
        return Array.from(lightbox.querySelectorAll(focusableSelector));
    }

    /**
     * Piège le focus au clavier (Tab / Shift+Tab) dans la lightbox.
     * @param {KeyboardEvent} e
     */
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusables = getFocusables();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function openLightbox(imgSrc, imgAlt) {
        previousActiveElement = document.activeElement;
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt || 'Image agrandie';
        lightbox.classList.add('is-open');
        lightbox.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        lightbox.addEventListener('keydown', trapFocus);
        requestAnimationFrame(() => {
            lightboxClose?.focus();
        });
    }

    /** Ferme la lightbox et restitue le focus à l'élément actif précédent. */
    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
        lightbox.removeEventListener('keydown', trapFocus);
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
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
