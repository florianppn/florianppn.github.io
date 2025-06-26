"use strict";

document.addEventListener('DOMContentLoaded', function() {
    const discordLink = document.getElementById('discordLink');
    const discordCopiedMessage = document.getElementById('discordCopiedMessage');

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

    const contactToggle = document.getElementById('contact-toggle');
    const categoriesToggle = document.getElementById('categories-toggle');

    const contactMenu = contactToggle.nextElementSibling;
    const categoriesMenu = categoriesToggle.nextElementSibling;
    
    function toggleMenu(menu) {
        menu.classList.toggle('active');
    }

    contactToggle.addEventListener('click', function() {
        toggleMenu(contactMenu);
        if (categoriesMenu.classList.contains('active')) {
            toggleMenu(categoriesMenu);
        }
    });

    categoriesToggle.addEventListener('click', function() {
        toggleMenu(categoriesMenu);
        if (contactMenu.classList.contains('active')) {
            toggleMenu(contactMenu);
        }
    });

});