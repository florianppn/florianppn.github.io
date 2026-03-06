"use strict";

import { initNav } from './nav.js';
import { initCarousel } from './carousel.js';
import { initLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCarousel();
    initLightbox();
});
