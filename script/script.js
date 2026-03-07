"use strict";

import { initNav } from './nav.js';
import { initCarousel } from './carousel.js';
import { initLightbox } from './lightbox.js';
import { initAccessibilityWidget } from './accessibility-widget.js';

document.addEventListener('DOMContentLoaded', () => {
    try { initNav(); } catch (e) { console.error('initNav', e); }
    try { initCarousel(); } catch (e) { console.error('initCarousel', e); }
    try { initLightbox(); } catch (e) { console.error('initLightbox', e); }
    try { initAccessibilityWidget(); } catch (e) { console.error('initAccessibilityWidget', e); }

    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
