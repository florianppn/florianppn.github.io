"use strict";

/**
 * Carousel des projets
 */
export function initCarousel() {
    const carousel = document.querySelector('.works-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.works-container');
    const cards = track.querySelectorAll('.works-card');
    const prevBtn = carousel.querySelector('.works-carousel-prev');
    const nextBtn = carousel.querySelector('.works-carousel-next');
    const dotsContainer = carousel.querySelector('.works-carousel-dots');

    if (!track || !dotsContainer) return;

    function getScrollAmount() {
        const card = cards[0];
        if (!card) return 350;
        const style = getComputedStyle(track);
        const gap = parseFloat(style.gap) || 32;
        return card.offsetWidth + gap;
    }

    // Créer les dots
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'works-carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Projet ' + (i + 1));
        dot.addEventListener('click', () => {
            track.scrollTo({ left: i * getScrollAmount(), behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.works-carousel-dot');

    function updateDots() {
        const amount = getScrollAmount();
        const scrollLeft = track.scrollLeft;
        const index = Math.round(scrollLeft / amount);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.min(index, cards.length - 1));
        });
    }

    prevBtn?.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateDots);
}
