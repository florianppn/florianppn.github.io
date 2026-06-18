"use strict";

import { GameEngine } from "./game/GameEngine.js";

/**
 * Initialise le déclencheur secret de 5 clics sur le logo dans la navbar.
 * Fait vibrer le logo à chaque clic et redirige vers la page dédiée game.html au bout de 5 clics.
 * @returns {void}
 */
export function initGameTrigger() {
    const logo = document.querySelector(".menu-container .logo");
    if (!logo) return;

    let logoClicks = 0;
    let lastClickTime = 0;

    logo.addEventListener("click", (e) => {
        e.preventDefault();

        // Déclenche l'animation de vibration/wiggle
        logo.classList.remove("clicked-hint");
        void logo.offsetWidth; // Force le reflow
        logo.classList.add("clicked-hint");

        const now = Date.now();
        if (now - lastClickTime < 1000) {
            logoClicks++;
        } else {
            logoClicks = 1;
        }
        lastClickTime = now;

        if (logoClicks === 5) {
            window.location.href = "./game.html";
            logoClicks = 0;
        }
    });
}

/**
 * Moteur de jeu autonome pour "Space Kickman" fonctionnant sur game.html.
 * @returns {void}
 */
export function runSpaceGame() {
    const canvas = document.getElementById("game-canvas");
    const scoreEl = document.getElementById("game-score");
    const highscoreEl = document.getElementById("game-highscore");
    const startBtn = document.getElementById("start-game-btn");

    if (!canvas || !scoreEl || !highscoreEl || !startBtn) return;

    // Chargement de l'image du joueur (logo du site)
    const playerImg = new Image();
    playerImg.onload = () => {
        const game = new GameEngine(canvas, scoreEl, highscoreEl, startBtn, playerImg);
        game.init();
    };
    playerImg.src = "./asset/logo/kickman.png";
}
