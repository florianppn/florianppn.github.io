"use strict";

/**
 * Initialise le carousel des projets : défilement horizontal, boutons prev/next, indicateurs dots.
 * Le scroll est réparti uniformément pour atteindre chaque projet.
 * @returns {void}
 */
export function initCarousel() {
    const carousel = document.querySelector('.works-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.works-container');
    const cards = track.querySelectorAll('.works-card');
    const prevBtn = carousel.querySelector('.works-carousel-prev');
    const nextBtn = carousel.querySelector('.works-carousel-next');
    const dotsContainer = carousel.querySelector('.works-carousel-dots');

    if (!track || !dotsContainer || cards.length === 0) return;

    function getScrollStep() {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) return 0;
        return maxScroll / (cards.length - 1);
    }

    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'works-carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Projet ' + (i + 1));
        dot.addEventListener('click', () => {
            const step = getScrollStep();
            const targetScroll = i * step;
            track.scrollTo({ left: targetScroll, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.works-carousel-dot');

    /** Met à jour la classe .active du dot correspondant à la position du scroll. */
    function updateDots() {
        const step = getScrollStep();
        if (step <= 0) return;
        const scrollLeft = track.scrollLeft;
        const index = Math.round(scrollLeft / step);
        const activeIndex = Math.min(Math.max(index, 0), cards.length - 1);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    prevBtn?.addEventListener('click', () => {
        const step = getScrollStep();
        const targetScroll = Math.max(0, track.scrollLeft - step);
        track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
        const step = getScrollStep();
        const maxScroll = track.scrollWidth - track.clientWidth;
        const targetScroll = Math.min(maxScroll, track.scrollLeft + step);
        track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateDots);
}
