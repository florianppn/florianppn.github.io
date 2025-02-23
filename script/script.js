"use strict";

const carousel = document.querySelector('.carousel');
const prevButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');
const workItems = document.querySelectorAll('.work-item');

let currentIndex = 0;

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevButton.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, workItems.length - 1);
    updateCarousel();
});

document.addEventListener('DOMContentLoaded', function() {
    const discordLink = document.getElementById('discordLink');
    const discordCopiedMessage = document.getElementById('discordCopiedMessage');

    discordLink.addEventListener('click', function(event) {
        event.preventDefault();

        const discordUrl = "requindelanight";

        navigator.clipboard.writeText(discordUrl)
            .then(() => {
                discordCopiedMessage.style.display = 'block';
                setTimeout(() => {
                    discordCopiedMessage.style.display = 'none';
                }, 2000);
            })
            .catch(err => {
                console.error('Impossible de copier le lien Discord : ', err);
            });
    });
});