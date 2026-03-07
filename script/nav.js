"use strict";

/**
 * Navigation : copie Discord, menus déroulants
 */
export function initNav() {
    const discordLink = document.getElementById('discordLink');
    const discordCopiedMessage = document.getElementById('discordCopiedMessage');

    if (discordLink && discordCopiedMessage) {
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
    }

    const contactToggle = document.getElementById('contact-toggle');
    const categoriesToggle = document.getElementById('categories-toggle');

    if (contactToggle && categoriesToggle) {
        const contactMenu = contactToggle.nextElementSibling;
        const categoriesMenu = categoriesToggle.nextElementSibling;

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

        categoriesMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                contactMenu.classList.remove('active');
                categoriesMenu.classList.remove('active');
                contactToggle.setAttribute('aria-expanded', 'false');
                categoriesToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}
