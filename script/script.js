"use strict";

/**
 * Point d'entrée du portfolio.
 * Initialise les modules (nav, carousel, lightbox, accessibilité) au chargement du DOM.
 * Met à jour l'année du copyright dans le footer.
 */
import { initNav } from './nav.js';
import { initCarousel } from './carousel.js';
import { initLightbox } from './lightbox.js';
import { initAccessibilityWidget } from './accessibility-widget.js';
import { initGameTrigger } from './game.js';
import { initTypewriter } from './typewriter.js';
import { initScrollEffects } from './scroll-effects.js';

document.addEventListener('DOMContentLoaded', () => {
    try { initNav(); } catch (e) { console.error('initNav', e); }
    try { initCarousel(); } catch (e) { console.error('initCarousel', e); }
    try { initLightbox(); } catch (e) { console.error('initLightbox', e); }
    try { initAccessibilityWidget(); } catch (e) { console.error('initAccessibilityWidget', e); }
    try { initGameTrigger(); } catch (e) { console.error('initGameTrigger', e); }
    try { initTypewriter(); } catch (e) { console.error('initTypewriter', e); }
    try { initScrollEffects(); } catch (e) { console.error('initScrollEffects', e); }

    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
