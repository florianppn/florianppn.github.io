"use strict";

const DISCORD_USERNAME = "requindelanight";
const BREAKPOINT_COPY_MESSAGE = 768;
const COPY_MESSAGE_DURATION_MS = 1000;

/**
 * Initialise la barre de navigation : copie du pseudo Discord, menus déroulants (contact, catégories).
 * Fermeture des menus au clic extérieur et à la navigation clavier (Enter/Espace).
 * @returns {void}
 */
export function initNav() {
    const discordLink = document.getElementById('discordLink');
    const discordCopiedMessage = document.getElementById('discordCopiedMessage');

    if (discordLink && discordCopiedMessage) {
        discordLink.addEventListener('click', function(event) {
            event.preventDefault();
            navigator.clipboard.writeText(DISCORD_USERNAME)
                .then(() => {
                    if (window.innerWidth >= BREAKPOINT_COPY_MESSAGE) {
                        discordCopiedMessage.style.display = 'block';
                        setTimeout(() => {
                            discordCopiedMessage.style.display = 'none';
                        }, COPY_MESSAGE_DURATION_MS);
                    }
                })
                .catch(err => {
                    console.error('Impossible de copier le lien Discord : ', err);
                });
        });
    }

    const contactToggle = document.getElementById('contact-toggle');
    const categoriesToggle = document.getElementById('categories-toggle');

    if (contactToggle && categoriesToggle) {
        const contactMenu = contactToggle.nextElementSibling;
        const categoriesMenu = categoriesToggle.nextElementSibling;

        /**
         * Bascule l'affichage d'un menu et met à jour aria-expanded.
         * @param {HTMLElement} menu - Élément ul du menu
         * @param {HTMLElement} [toggleBtn] - Bouton associé
         */
        function toggleMenu(menu, toggleBtn) {
            const isOpen = menu.classList.toggle('active');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', isOpen);
            }
        }

        contactToggle.addEventListener('click', function() {
            toggleMenu(contactMenu, contactToggle);
            if (categoriesMenu.classList.contains('active')) {
                toggleMenu(categoriesMenu, categoriesToggle);
            }
        });

        categoriesToggle.addEventListener('click', function() {
            toggleMenu(categoriesMenu, categoriesToggle);
            if (contactMenu.classList.contains('active')) {
                toggleMenu(contactMenu, contactToggle);
            }
        });

        contactToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                contactToggle.click();
            }
        });
        categoriesToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                categoriesToggle.click();
            }
        });

        document.addEventListener('click', function(e) {
            if (!contactToggle.contains(e.target) && !categoriesToggle.contains(e.target) &&
                !contactMenu.contains(e.target) && !categoriesMenu.contains(e.target)) {
                contactMenu.classList.remove('active');
                categoriesMenu.classList.remove('active');
                contactToggle.setAttribute('aria-expanded', 'false');
                categoriesToggle.setAttribute('aria-expanded', 'false');
            }
        });

        categoriesMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                contactMenu.classList.remove('active');
                categoriesMenu.classList.remove('active');
                contactToggle.setAttribute('aria-expanded', 'false');
                categoriesToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}
