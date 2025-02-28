"use strict";

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

document.addEventListener('DOMContentLoaded', () => {
    const username = 'florianppn';
    const projectsCarousel = document.getElementById('github-projects-carousel');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => {
                if (repo.name != "florianppn.github.io" && repo.name != "florianppn") {
                    const workItem = document.createElement('div');
                    workItem.classList.add('work-item');
                    console.log(repo.name);
                    workItem.innerHTML = `
                        <div class="work-frame">
                            <h3>${repo.name || 'Aucun nom disponible'}</h3>
                            <img class="works-image" src="https://raw.githubusercontent.com/florianppn/${repo.name}/refs/heads/main/screenshots/${repo.name}.png" alt="Aucune image disponible">
                            <p>${repo.description || 'Aucune description disponible'}</p>
                            <a href="${repo.html_url}" target="_blank"><i class="fa-solid fa-up-right-from-square"></i> Code source</a>
                        </div>
                    `;
                    projectsCarousel.appendChild(workItem);
                }
            });

            const workItems = document.querySelectorAll('.work-item');
            let currentIndex = 0;

            function showItem(index) {
                const carousel = document.querySelector('.carousel');
                const itemWidth = document.querySelector('.work-item').offsetWidth;
                carousel.style.transform = `translateX(${-index * itemWidth}px)`;
            }

            function nextItem() {
                currentIndex = (currentIndex + 1) % workItems.length;
                showItem(currentIndex);
            }

            function prevItem() {
                currentIndex = (currentIndex - 1 + workItems.length) % workItems.length;
                showItem(currentIndex);
            }

            nextButton.addEventListener('click', nextItem);
            prevButton.addEventListener('click', prevItem);

            showItem(currentIndex);
        })
        .catch(error => console.error('Erreur lors de la récupération des projets GitHub:', error));
});