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

function encrypt(text, shift) {
    let res = "";
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        res += String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        res += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
      } else {
        res += text.charAt(i);
      }
    }
    return res;
  }

  window.onload = function() {
    const spans = document.querySelectorAll("#profil span");
    const shift = 3;
    const animationDuration = 10000;
    const intervals = 150;
  
    spans.forEach(span => {
      const originalText = span.dataset.originalText;
      const encryptText = encrypt(originalText, shift);
      span.textContent = encryptText;
  
      let index = 0;
      const intervalle = setInterval(() => {
        if (index >= originalText.length) {
          clearInterval(intervalle);
          return;
        }
        span.textContent = originalText.substring(0, index + 1) + encryptText.substring(index + 1);
        index++;
      }, animationDuration / intervals);
    });
  };