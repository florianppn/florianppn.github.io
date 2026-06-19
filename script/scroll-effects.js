"use strict";

/**
 * Initialise les effets de défilement (barre de progression de lecture).
 * @returns {void}
 */
export function initScrollEffects() {
    // 1. Barre de progression de lecture (Scroll Progress Bar)
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    const updateProgressBar = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar(); // Calcul initial
}
