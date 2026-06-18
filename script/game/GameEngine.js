"use strict";

import { Ship } from "./Ship.js";
import { Asteroid } from "./Asteroid.js";
import { Laser } from "./Laser.js";
import { Particle } from "./Particle.js";
import { Star } from "./Star.js";
import { InputManager } from "./InputManager.js";
import { CanvasRenderer } from "./CanvasRenderer.js";

const HIGHSCORE_KEY = "kickman-highscore";
const TECHS_TO_DODGE = [
    { name: "Java", icon: "\uf4e4" },
    { name: "Python", icon: "\uf3e2" },
    { name: "PHP", icon: "\uf457" },
    { name: "Symfony", icon: "\uf83d" },
    { name: "Rust", icon: "\ue07a" },
    { name: "WordPress", icon: "\uf411" },
    { name: "Angular", icon: "\uf420" },
    { name: "React", icon: "\uf41b" },
    { name: "NodeJS", icon: "\uf3d3" },
    { name: "Docker", icon: "\uf395" },
    { name: "HTML5", icon: "\uf13b" },
    { name: "CSS3", icon: "\uf38b" },
    { name: "JS", icon: "\uf3b8" },
    { name: "Git", icon: "\uf1d3" },
    { name: "Android", icon: "\uf17b" },
    { name: "Apple", icon: "\uf179" },
    { name: "Linux", icon: "\uf17c" }
];

/**
 * Main game orchestrator class.
 */
export class GameEngine {
    constructor(canvas, scoreEl, highscoreEl, startBtn, playerImg) {
        this.canvas = canvas;
        this.scoreEl = scoreEl;
        this.highscoreEl = highscoreEl;
        this.startBtn = startBtn;

        this.renderer = new CanvasRenderer(canvas, playerImg);
        this.inputManager = new InputManager(canvas, this.onAction.bind(this));
        this.ship = new Ship();

        this.state = "idle"; // 'idle', 'playing', 'gameover'
        this.score = 0;
        this.highscore = parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10);
        this.frame = 0;
        this.lasers = [];
        this.asteroids = [];
        this.particles = [];
        this.stars = [];
        this.showSpeedUp = 0;
        this.lastSpeedMultiplier = 0;

        this.loop = this.loop.bind(this);
    }

    /**
     * Initializes elements, listeners, and starts the game loop.
     * @returns {void}
     */
    init() {
        this.highscoreEl.textContent = this.highscore.toString();

        this.startBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.startGame();
        });

        this.inputManager.init();
        this.resetGame();
        this.loop();
    }

    /**
     * Helper to read high-contrast active state.
     * @returns {boolean}
     */
    isContrast() {
        return document.body.classList.contains("a11y-contrast");
    }

    /**
     * Helper to read dyslexia active state.
     * @returns {boolean}
     */
    isDyslexia() {
        return document.body.classList.contains("a11y-dyslexia");
    }

    /**
     * Translates actions received from InputManager to game events.
     * @param {string} actionType - Triggered action type ('click', 'up', 'down', 'action').
     * @returns {void}
     */
    onAction(actionType) {
        if (this.state === "playing") {
            if (actionType === "up") {
                this.inputManager.mouseY = Math.max(this.ship.h / 2, this.inputManager.mouseY - 20);
            } else if (actionType === "down") {
                this.inputManager.mouseY = Math.min(this.canvas.height - this.ship.h / 2, this.inputManager.mouseY + 20);
            } else if (actionType === "action" || actionType === "click") {
                this.fireLaser();
            }
        } else if (actionType === "action" || actionType === "click") {
            this.startGame();
        }
    }

    /**
     * Resets score, frames, arrays, and generates stars.
     * @returns {void}
     */
    resetGame() {
        this.state = "idle";
        this.score = 0;
        this.scoreEl.textContent = "0";
        this.ship.y = 180;
        this.lasers = [];
        this.asteroids = [];
        this.particles = [];
        this.frame = 0;
        this.showSpeedUp = 0;
        this.lastSpeedMultiplier = 0;
        this.inputManager.reset();

        // Parallax stars initial generation
        this.stars = [];
        for (let i = 0; i < 35; i++) {
            const size = 0.8 + Math.random() * 1.5;
            const speed = 0.3 + Math.random() * 1.2;
            this.stars.push(new Star(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                speed,
                size
            ));
        }
    }

    /**
     * Switches state to playing.
     * @returns {void}
     */
    startGame() {
        this.resetGame();
        this.state = "playing";
        this.startBtn.style.display = "none";
        this.startBtn.blur();
    }

    /**
     * Fires a projectile from ship front.
     * @returns {void}
     */
    fireLaser() {
        this.lasers.push(new Laser(
            this.ship.x + this.ship.w,
            this.ship.y + this.ship.h / 2
        ));
    }

    /**
     * Game Over trigger.
     * @returns {void}
     */
    gameOver() {
        this.state = "gameover";
        this.startBtn.style.display = "inline-block";
        this.startBtn.textContent = "Recommencer";
    }

    /**
     * Creates particle explosion debris at coordinates.
     * @param {number} x - Horizontal coordinate.
     * @param {number} y - Vertical coordinate.
     * @returns {void}
     */
    createExplosion(x, y) {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3.5;
            const radius = 1 + Math.random() * 2;
            const decay = 0.02 + Math.random() * 0.03;
            const color = this.isContrast()
                ? "#3dd4cf"
                : (Math.random() > 0.5 ? "#FF5E3A" : "#178582");

            this.particles.push(new Particle(
                x,
                y,
                Math.cos(angle) * speed - 0.5,
                Math.sin(angle) * speed,
                radius,
                color,
                1.0,
                1.0,
                decay
            ));
        }
    }

    /**
     * Updates positions, collisions, and spawns of all elements.
     * @returns {void}
     */
    update() {
        const isContrast = this.isContrast();

        // 1. Parallax background stars update
        this.stars.forEach(s => s.updateWithSpeed(1.0, this.canvas.width, this.canvas.height));

        // 2. Ship smooth movement update
        this.ship.updatePosition(this.inputManager.mouseY, this.canvas.height);

        // 3. Trail thruster particle generation
        if (this.frame % 3 === 0) {
            const color = isContrast
                ? "#3dd4cf"
                : (Math.random() > 0.4 ? "#FF5E3A" : "#BFA181");
            this.particles.push(new Particle(
                this.ship.x,
                this.ship.y + this.ship.h / 2 + (Math.random() - 0.5) * 6,
                -1.5 - Math.random() * 1.5,
                (Math.random() - 0.5) * 0.6,
                1 + Math.random() * 1.5,
                color,
                0.8,
                0.6,
                0.03
            ));
        }

        // 4. Auto shooting fire
        if (this.frame % 15 === 0) {
            this.fireLaser();
        }

        // 5. Lasers movement update
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const l = this.lasers[i];
            l.update();
            if (l.isOutOfBounds(this.canvas.width)) {
                this.lasers.splice(i, 1);
            }
        }

        // 6. Generate obstacles (Asteroids) scaling difficulty by score
        const speedMultiplier = Math.floor(this.score / 250);
        const spawnInterval = Math.max(35, 105 - speedMultiplier * 25);
        if (this.frame % spawnInterval === 0) {
            const radius = 24 + Math.floor(Math.random() * 14);
            const asteroidY = radius + Math.random() * (this.canvas.height - radius * 2);
            const speed = 1.0 + Math.random() * 0.6 + speedMultiplier * 0.8;
            const tech = TECHS_TO_DODGE[Math.floor(Math.random() * TECHS_TO_DODGE.length)];
            
            // Random polygon offsets for jagged details
            const numPoints = 8;
            const offsets = [];
            for (let k = 0; k < numPoints; k++) {
                offsets.push((Math.random() - 0.5) * (radius * 0.35));
            }

            this.asteroids.push(new Asteroid(
                this.canvas.width + radius,
                asteroidY,
                radius,
                speed,
                tech.name,
                tech.icon,
                offsets
            ));
        }

        // 7. Asteroids move, wrap check, and collisions (Lasers & Player)
        const shipRadius = 15;
        const shipCx = this.ship.x + this.ship.w / 2;
        const shipCy = this.ship.y + this.ship.h / 2;
        
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const a = this.asteroids[i];
            a.update();

            if (a.isOutOfBounds()) {
                this.asteroids.splice(i, 1);
                continue;
            }

            // Ship collision (circle collision formula)
            const distShip = Math.hypot(shipCx - a.x, shipCy - a.y);
            if (distShip < shipRadius + a.r) {
                this.gameOver();
                return;
            }

            // Lasers collision (point in circle)
            for (let j = this.lasers.length - 1; j >= 0; j--) {
                const l = this.lasers[j];
                const distLaser = Math.hypot(l.x - a.x, l.y - a.y);
                if (distLaser < a.r) {
                    this.createExplosion(a.x, a.y);
                    this.lasers.splice(j, 1);
                    this.asteroids.splice(i, 1);

                    // Score increase
                    this.score += 10;
                    this.scoreEl.textContent = this.score.toString();

                    // Speed wave transition alert trigger
                    const currentMultiplier = Math.floor(this.score / 250);
                    if (currentMultiplier > this.lastSpeedMultiplier) {
                        this.showSpeedUp = 120;
                        this.lastSpeedMultiplier = currentMultiplier;
                    }

                    // Highscore save check
                    if (this.score > this.highscore) {
                        this.highscore = this.score;
                        this.highscoreEl.textContent = this.highscore.toString();
                        try {
                            localStorage.setItem(HIGHSCORE_KEY, this.highscore.toString());
                        } catch {
                            // ignore
                        }
                    }
                    break;
                }
            }
        }

        // 8. Particles update
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }

        // 9. Wave warning alert timer decrement
        if (this.showSpeedUp > 0) {
            this.showSpeedUp--;
        }
    }

    /**
     * Performs standard render of playing game state.
     * @returns {void}
     */
    render() {
        const isContrast = this.isContrast();
        const isDyslexia = this.isDyslexia();

        this.renderer.clear(isContrast);
        this.renderer.drawStars(this.stars, isContrast);
        this.renderer.drawLasers(this.lasers, isContrast);
        this.renderer.drawAsteroids(this.asteroids, isContrast);
        this.renderer.drawParticles(this.particles);
        this.renderer.drawPlayerShip(this.ship, this.inputManager.mouseY, isContrast);
        this.renderer.drawSpeedUpAlert(this.showSpeedUp, this.frame, this.score, isContrast, isDyslexia);
    }

    /**
     * Main animation loop callback.
     * @returns {void}
     */
    loop() {
        const isContrast = this.isContrast();
        const isDyslexia = this.isDyslexia();

        if (this.state === "playing") {
            this.update();
            this.render();
            this.frame++;
            requestAnimationFrame(this.loop);
        } else if (this.state === "idle") {
            this.stars.forEach(s => s.updateWithSpeed(0.2, this.canvas.width, this.canvas.height));
            this.renderer.drawIdleScreen(this.stars, this.ship, this.frame, isContrast, isDyslexia);
            this.frame++;
            requestAnimationFrame(this.loop);
        } else if (this.state === "gameover") {
            this.stars.forEach(s => s.updateWithSpeed(0.1, this.canvas.width, this.canvas.height));
            this.asteroids.forEach(a => {
                a.x += a.vx * 0.2;
                a.angle += a.spinSpeed * 0.2;
            });
            this.render();
            this.renderer.drawGameOverScreen(this.score, isContrast, isDyslexia);
            this.frame++;
            requestAnimationFrame(this.loop);
        }
    }
}
