"use strict";

/**
 * Class wrapping all drawing operations on the HTML5 canvas.
 */
export class CanvasRenderer {
    /**
     * @param {HTMLCanvasElement} canvas - The drawing canvas element.
     * @param {HTMLImageElement} playerImg - Image element representing the player ship.
     */
    constructor(canvas, playerImg) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.playerImg = playerImg;
    }

    /**
     * Clears the canvas with a background fill.
     * @param {boolean} isContrast - If high-contrast is active.
     * @returns {void}
     */
    clear(isContrast) {
        this.ctx.fillStyle = isContrast ? "#0a0f14" : "#0A1826";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Helper to load correct font depending on dyslexia mode.
     * @param {string} baseStyle - The default css font styling string.
     * @param {boolean} isDyslexia - If dyslexia font mode is active.
     * @returns {string}
     */
    getFont(baseStyle, isDyslexia) {
        if (isDyslexia) {
            return baseStyle.replace(/Orbitron|sans-serif/g, "OpenDyslexic");
        }
        return baseStyle;
    }

    /**
     * Draws background stars.
     * @param {Array<object>} stars - Array of stars to draw.
     * @param {boolean} isContrast - If high contrast mode is active.
     * @returns {void}
     */
    drawStars(stars, isContrast) {
        this.ctx.fillStyle = isContrast ? "#ffffff" : "rgba(255, 255, 255, 0.4)";
        stars.forEach(s => {
            this.ctx.fillRect(s.x, s.y, s.size, s.size);
        });
    }

    /**
     * Draws player laser projectiles.
     * @param {Array<object>} lasers - Array of lasers to draw.
     * @param {boolean} isContrast - If high contrast mode is active.
     * @returns {void}
     */
    drawLasers(lasers, isContrast) {
        this.ctx.fillStyle = isContrast ? "#3dd4cf" : "#FF5E3A";
        this.ctx.shadowBlur = isContrast ? 0 : 8;
        this.ctx.shadowColor = isContrast ? "transparent" : "#FF5E3A";
        lasers.forEach(l => {
            this.ctx.fillRect(l.x, l.y - l.h / 2, l.w, l.h);
        });
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draws obstacle technology asteroids.
     * @param {Array<object>} asteroids - Array of asteroids to draw.
     * @param {boolean} isContrast - If high contrast mode is active.
     * @returns {void}
     */
    drawAsteroids(asteroids, isContrast) {
        asteroids.forEach(a => {
            this.ctx.save();
            this.ctx.translate(a.x, a.y);
            this.ctx.rotate(a.angle);
            
            // Draw irregular polygonal shape
            this.ctx.beginPath();
            const numPoints = 8;
            for (let k = 0; k < numPoints; k++) {
                const angle = (k / numPoints) * Math.PI * 2;
                const dist = a.r + a.offsets[k];
                const px = Math.cos(angle) * dist;
                const py = Math.sin(angle) * dist;
                if (k === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            this.ctx.closePath();

            this.ctx.fillStyle = isContrast ? "#0a0f14" : "#12202E";
            this.ctx.fill();
            
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = isContrast ? "#3dd4cf" : "#178582";
            this.ctx.shadowBlur = isContrast ? 0 : 8;
            this.ctx.shadowColor = isContrast ? "transparent" : "#178582";
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;

            // Tech icon inside asteroid
            this.ctx.fillStyle = isContrast ? "#3dd4cf" : "#BFA181";
            const iconSize = Math.round(a.r * 0.9);
            this.ctx.font = `${iconSize}px 'Font Awesome 6 Brands'`;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(a.techIcon, 0, 0);

            this.ctx.restore();
        });
    }

    /**
     * Draws particles (explosion debris & trails).
     * @param {Array<object>} particles - Array of active particles.
     * @returns {void}
     */
    drawParticles(particles) {
        particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    /**
     * Draws the player ship with smooth tilt angles and optional high contrast filters.
     * @param {object} ship - The player Ship instance.
     * @param {number} mouseY - Target mouse position.
     * @param {boolean} isContrast - If high contrast mode is active.
     * @returns {void}
     */
    drawPlayerShip(ship, mouseY, isContrast) {
        this.ctx.save();
        this.ctx.translate(ship.x + ship.w / 2, ship.y + ship.h / 2);
        
        // Slight tilt depending on vertical distance to target cursor
        const diffY = (mouseY - ship.h / 2) - ship.y;
        const angle = Math.min(Math.max(diffY * 0.005, -0.25), 0.25);
        this.ctx.rotate(angle);
        
        if (isContrast) {
            this.ctx.filter = "grayscale(100%) brightness(1.5) contrast(200%)";
        }
        this.ctx.drawImage(this.playerImg, -ship.w / 2, -ship.h / 2, ship.w, ship.h);
        this.ctx.restore();
    }

    /**
     * Draws the Speed Up wave change overlay alert text.
     * @param {number} showSpeedUp - The frame countdown of the alert.
     * @param {number} frame - Current frame number.
     * @param {number} score - Current game score.
     * @param {boolean} isContrast - If high contrast mode is active.
     * @param {boolean} isDyslexia - If dyslexia font mode is active.
     * @returns {void}
     */
    drawSpeedUpAlert(showSpeedUp, frame, score, isContrast, isDyslexia) {
        if (showSpeedUp > 0) {
            this.ctx.save();
            this.ctx.fillStyle = isContrast ? "#3dd4cf" : "#FF5E3A";
            this.ctx.font = this.getFont("bold 20px Orbitron, sans-serif", isDyslexia);
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.shadowBlur = isContrast ? 0 : 10;
            this.ctx.shadowColor = isContrast ? "transparent" : "#FF5E3A";
            
            // Flashing blinking text effect
            if (Math.floor(frame / 10) % 2 === 0) {
                const waveNumber = Math.floor(score / 250) + 1;
                this.ctx.fillText(`VAGUE ${waveNumber} - ACCÉLÉRATION !`, this.canvas.width / 2, this.canvas.height / 2 - 20);
            }
            this.ctx.restore();
        }
    }

    /**
     * Draws the Idle Screen.
     * @param {Array<object>} stars - Parallax stars.
     * @param {object} ship - Player Ship instance.
     * @param {number} frame - Current frame number.
     * @param {boolean} isContrast - If high contrast mode is active.
     * @param {boolean} isDyslexia - If dyslexia font mode is active.
     * @returns {void}
     */
    drawIdleScreen(stars, ship, frame, isContrast, isDyslexia) {
        this.clear(isContrast);
        this.drawStars(stars, isContrast);

        this.ctx.fillStyle = isContrast ? "#3dd4cf" : "#BFA181";
        this.ctx.font = this.getFont("bold 22px Orbitron, sans-serif", isDyslexia);
        this.ctx.textAlign = "center";
        this.ctx.fillText("SPACE KICKMAN", this.canvas.width / 2, this.canvas.height / 2 - 50);

        // Floating ship render
        const floatY = this.canvas.height / 2 - ship.h / 2 + Math.sin(frame * 0.05) * 6;
        this.ctx.save();
        if (isContrast) {
            this.ctx.filter = "grayscale(100%) brightness(1.5) contrast(200%)";
        }
        this.ctx.drawImage(this.playerImg, ship.x, floatY, ship.w, ship.h);
        this.ctx.restore();
    }

    /**
     * Draws the Game Over text overlay screen.
     * @param {number} score - Final score of the session.
     * @param {boolean} isContrast - If high contrast mode is active.
     * @param {boolean} isDyslexia - If dyslexia font mode is active.
     * @returns {void}
     */
    drawGameOverScreen(score, isContrast, isDyslexia) {
        this.ctx.fillStyle = isContrast ? "rgba(10, 15, 20, 0.95)" : "rgba(10, 24, 38, 0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = isContrast ? "#3dd4cf" : "#ff4a4a";
        this.ctx.font = this.getFont("bold 26px Orbitron, sans-serif", isDyslexia);
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 30);

        this.ctx.fillStyle = isContrast ? "#e8e0d5" : "#BFA181";
        this.ctx.font = this.getFont("16px Orbitron, sans-serif", isDyslexia);
        this.ctx.fillText(`Score final : ${score} pts`, this.canvas.width / 2, this.canvas.height / 2 + 15);
    }
}
