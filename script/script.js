"use strict";

document.addEventListener('DOMContentLoaded', function() {
    const discordLink = document.getElementById('discordLink');
    const discordCopiedMessage = document.getElementById('discordCopiedMessage');
    const alertCopy = document.querySelector('.alert-copy a');

    discordLink.addEventListener('click', function(event) {
        event.preventDefault();

        const discordUrl = "requindelanight";

        navigator.clipboard.writeText(discordUrl)
            .then(() => {
                if (window.innerWidth >= 768) {
                    discordCopiedMessage.style.display = 'block';
                    setTimeout(() => {
                        discordCopiedMessage.style.display = 'none';
                    }, 1000);
                }
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
                    workItem.innerHTML = `
                        <div class="work-frame">
                            <h4>${repo.name || 'Aucun nom disponible'}</h4>
                            <figure>
                              <img class="works-image" src="https://raw.githubusercontent.com/florianppn/${repo.name}/refs/heads/main/screenshots/${repo.name}.png" alt="Aucune image disponible">
                            </figure>
                            <p class="work-description">${repo.description || 'Aucune description disponible pour le moment.'}</p>
                            <div class="work-links">
                              <a href="${repo.html_url || '#'}" target="_blank"><i class="fa-solid fa-up-right-from-square"></i> Code source</a>
                              <a href="https://github.com/florianppn/${repo.name}/archive/master.zip"><i class="fa-regular fa-circle-down"></i> Télécharger le dépôt</a>
                            </div>
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