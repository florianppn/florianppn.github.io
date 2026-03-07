"use strict";

import { initNav } from './nav.js';
import { initCarousel } from './carousel.js';
import { initLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCarousel();
    initLightbox();

    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
