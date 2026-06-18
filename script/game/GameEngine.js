"use strict";

import { InputManager } from "./InputManager.js";
import { CanvasRenderer } from "./CanvasRenderer.js";
import { ScoreManager } from "./ScoreManager.js";
import { EntityManager } from "./EntityManager.js";

/**
 * Classe principale d'orchestration du jeu.
 */
export class GameEngine {
    constructor(canvas, scoreEl, highscoreEl, startBtn, playerImg) {
        this.canvas = canvas;
        this.startBtn = startBtn;

        this.renderer = new CanvasRenderer(canvas, playerImg);
        this.inputManager = new InputManager(canvas, this.onAction.bind(this));
        
        this.scoreManager = new ScoreManager(scoreEl, highscoreEl);
        this.entityManager = new EntityManager(
            canvas.width,
            canvas.height,
            this.onShipCollision.bind(this),
            this.onAsteroidDestroyed.bind(this)
        );

        this.state = "idle"; // 'idle', 'playing', 'gameover'
        this.frame = 0;
        this.showSpeedUp = 0;
        this.lastTime = 0;
        this.accumulator = 0;

        this.loop = this.loop.bind(this);
    }

    /**
     * Initialise les éléments, écouteurs et démarre la boucle de jeu.
     * @returns {void}
     */
    init() {
        this.scoreManager.init();

        this.startBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.startGame();
        });

        this.inputManager.init();
        this.resetGame();
        this.loop();
    }

    /**
     * Aide pour lire si le mode contraste renforcé est actif.
     * @returns {boolean}
     */
    isContrast() {
        return document.body.classList.contains("a11y-contrast");
    }

    /**
     * Aide pour lire si le mode dyslexie est actif.
     * @returns {boolean}
     */
    isDyslexia() {
        return document.body.classList.contains("a11y-dyslexia");
    }

    /**
     * Traduit les actions reçues de l'InputManager en événements de jeu.
     * @param {string} actionType - Type d'action déclenchée ('click', 'up', 'down', 'action').
     * @returns {void}
     */
    onAction(actionType) {
        if (this.state === "playing") {
            const ship = this.entityManager.ship;
            if (actionType === "up") {
                this.inputManager.mouseY = Math.max(ship.h / 2, this.inputManager.mouseY - 20);
            } else if (actionType === "down") {
                this.inputManager.mouseY = Math.min(this.canvas.height - ship.h / 2, this.inputManager.mouseY + 20);
            } else if (actionType === "action" || actionType === "click") {
                this.entityManager.fireLaser();
            }
        } else if (actionType === "action" || actionType === "click") {
            this.startGame();
        }
    }

    /**
     * Réinitialise le score, les frames, les entités et génère les étoiles de fond.
     * @returns {void}
     */
    resetGame() {
        this.state = "idle";
        this.scoreManager.reset();
        this.entityManager.reset();
        this.frame = 0;
        this.showSpeedUp = 0;
        this.inputManager.reset();
    }

    /**
     * Passe l'état du jeu à "playing" (en cours de jeu).
     * @returns {void}
     */
    startGame() {
        this.resetGame();
        this.state = "playing";
        this.startBtn.style.display = "none";
        this.startBtn.blur();
    }

    /**
     * Callback de déclenchement du Game Over.
     * @returns {void}
     */
    onShipCollision() {
        this.state = "gameover";
        this.startBtn.style.display = "inline-block";
        this.startBtn.textContent = "Recommencer";
    }

    /**
     * Callback d'augmentation du score et de détection de nouvelle vague de vitesse.
     * @returns {void}
     */
    onAsteroidDestroyed() {
        const isSpeedUp = this.scoreManager.addScore(10);
        if (isSpeedUp) {
            this.showSpeedUp = 120;
        }
    }

    /**
     * Met à jour la physique globale du jeu.
     * @returns {void}
     */
    update() {
        this.entityManager.update(
            this.frame,
            this.scoreManager.getScore(),
            this.isContrast(),
            this.inputManager.mouseY
        );

        if (this.showSpeedUp > 0) {
            this.showSpeedUp--;
        }
    }

    /**
     * Effectue le rendu graphique standard du jeu.
     * @returns {void}
     */
    render() {
        const isContrast = this.isContrast();
        const isDyslexia = this.isDyslexia();
        const entities = this.entityManager;

        this.renderer.clear(isContrast);
        this.renderer.drawStars(entities.stars, isContrast);
        this.renderer.drawLasers(entities.lasers, isContrast);
        this.renderer.drawAsteroids(entities.asteroids, isContrast);
        this.renderer.drawParticles(entities.particles);
        this.renderer.drawPlayerShip(entities.ship, this.inputManager.mouseY, isContrast);
        this.renderer.drawSpeedUpAlert(
            this.showSpeedUp,
            this.frame,
            this.scoreManager.getScore(),
            isContrast,
            isDyslexia
        );
    }

    /**
     * Boucle principale d'animation cadencée par requestAnimationFrame.
     * @param {number} [timestamp] - Horodatage haute résolution actuel transmis par le navigateur.
     * @returns {void}
     */
    loop(timestamp) {
        if (!timestamp) {
            timestamp = performance.now();
        }

        if (!this.lastTime) {
            this.lastTime = timestamp;
        }

        let elapsed = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Évite la "spirale de la mort" si l'onglet est suspendu ou en cas de gros lag
        if (elapsed > 250) {
            elapsed = 250;
        }

        this.accumulator += elapsed;

        const isContrast = this.isContrast();
        const isDyslexia = this.isDyslexia();
        const timestep = 1000 / 60; // 16.67 ms (60 FPS)

        while (this.accumulator >= timestep) {
            if (this.state === "playing") {
                this.update();
            } else if (this.state === "idle") {
                this.entityManager.stars.forEach(s => s.updateWithSpeed(0.2, this.canvas.width, this.canvas.height));
            } else if (this.state === "gameover") {
                this.entityManager.stars.forEach(s => s.updateWithSpeed(0.1, this.canvas.width, this.canvas.height));
                this.entityManager.asteroids.forEach(a => {
                    a.x += a.vx * 0.2;
                    a.angle += a.spinSpeed * 0.2;
                });
            }
            this.frame++;
            this.accumulator -= timestep;
        }

        // Dessin graphique une seule fois par trame d'affichage
        if (this.state === "playing") {
            this.render();
        } else if (this.state === "idle") {
            this.renderer.drawIdleScreen(
                this.entityManager.stars,
                this.entityManager.ship,
                this.frame,
                isContrast,
                isDyslexia
            );
        } else if (this.state === "gameover") {
            this.render();
            this.renderer.drawGameOverScreen(this.scoreManager.getScore(), isContrast, isDyslexia);
        }

        requestAnimationFrame(this.loop);
    }
}
