"use strict";

/**
 * Classe enveloppant toutes les opérations de dessin sur le canvas HTML5.
 */
export class CanvasRenderer {
    /**
     * @param {HTMLCanvasElement} canvas - Le canvas de dessin.
     * @param {HTMLImageElement} playerImg - Image représentant le vaisseau du joueur.
     */
    constructor(canvas, playerImg) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.playerImg = playerImg;
    }

    /**
     * Nettoie le canvas avec un fond uni.
     * @param {boolean} isContrast - Si le mode contraste renforcé est actif.
     * @returns {void}
     */
    clear(isContrast) {
        this.ctx.fillStyle = isContrast ? "#0a0f14" : "#0A1826";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Aide pour charger la bonne police selon le mode dyslexie.
     * @param {string} baseStyle - La chaîne de style de police CSS par défaut.
     * @param {boolean} isDyslexia - Si la police dyslexie est active.
     * @returns {string}
     */
    getFont(baseStyle, isDyslexia) {
        if (isDyslexia) {
            return baseStyle.replace(/Orbitron|sans-serif/g, "OpenDyslexic");
        }
        return baseStyle;
    }

    /**
     * Dessine les étoiles d'arrière-plan.
     * @param {Array<object>} stars - Tableau d'étoiles à dessiner.
     * @param {boolean} isContrast - Si le contraste renforcé est actif.
     * @returns {void}
     */
    drawStars(stars, isContrast) {
        this.ctx.fillStyle = isContrast ? "#ffffff" : "rgba(255, 255, 255, 0.4)";
        stars.forEach(s => {
            this.ctx.fillRect(s.x, s.y, s.size, s.size);
        });
    }

    /**
     * Dessine les projectiles laser du joueur.
     * @param {Array<object>} lasers - Tableau de lasers à dessiner.
     * @param {boolean} isContrast - Si le contraste renforcé est actif.
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
     * Dessine les astéroïdes technologiques.
     * @param {Array<object>} asteroids - Tableau d'astéroïdes à dessiner.
     * @param {boolean} isContrast - Si le contraste renforcé est actif.
     * @returns {void}
     */
    drawAsteroids(asteroids, isContrast) {
        asteroids.forEach(a => {
            this.ctx.save();
            this.ctx.translate(a.x, a.y);
            this.ctx.rotate(a.angle);
            
            // Dessine la forme polygonale irrégulière
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

            // Icône de technologie à l'intérieur de l'astéroïde
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
     * Dessine les particules (débris d'explosion et traînées).
     * @param {Array<object>} particles - Tableau de particules actives.
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
     * Dessine le vaisseau du joueur avec une inclinaison fluide et des filtres optionnels pour le contraste élevé.
     * @param {object} ship - L'instance du vaisseau du joueur.
     * @param {number} mouseY - Position cible de la souris.
     * @param {boolean} isContrast - Si le contraste renforcé est actif.
     * @returns {void}
     */
    drawPlayerShip(ship, mouseY, isContrast) {
        this.ctx.save();
        this.ctx.translate(ship.x + ship.w / 2, ship.y + ship.h / 2);
        
        // Légère inclinaison en fonction de la distance verticale avec le curseur cible
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
     * Dessine l'alerte textuelle de changement de vague ("Speed Up").
     * @param {number} showSpeedUp - Le compte à rebours de l'alerte en frames.
     * @param {number} frame - Numéro de la frame actuelle.
     * @param {number} score - Score actuel du jeu.
     * @param {boolean} isContrast - Si le contraste renforcé est actif.
     * @param {boolean} isDyslexia - Si la police dyslexie est active.
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
            
            // Effet de clignotement du texte
            if (Math.floor(frame / 10) % 2 === 0) {
                const waveNumber = Math.floor(score / 250) + 1;
                this.ctx.fillText(`VAGUE ${waveNumber} - ACCÉLÉRATION !`, this.canvas.width / 2, this.canvas.height / 2 - 20);
            }
            this.ctx.restore();
        }
    }

    /**
     * Dessine l'écran d'accueil (état d'attente).
     * @param {Array<object>} stars - Étoiles en arrière-plan.
     * @param {object} ship - Instance du vaisseau du joueur.
     * @param {number} frame - Numéro de la frame actuelle.
     * @param {boolean} isContrast - Si le contraste renforcé est actif.
     * @param {boolean} isDyslexia - Si la police dyslexie est active.
     * @returns {void}
     */
    drawIdleScreen(stars, ship, frame, isContrast, isDyslexia) {
        this.clear(isContrast);
        this.drawStars(stars, isContrast);

        this.ctx.fillStyle = isContrast ? "#3dd4cf" : "#BFA181";
        this.ctx.font = this.getFont("bold 22px Orbitron, sans-serif", isDyslexia);
        this.ctx.textAlign = "center";
        this.ctx.fillText("SPACE KICKMAN", this.canvas.width / 2, this.canvas.height / 2 - 50);

        // Rendu du vaisseau flottant
        const floatY = this.canvas.height / 2 - ship.h / 2 + Math.sin(frame * 0.05) * 6;
        this.ctx.save();
        if (isContrast) {
            this.ctx.filter = "grayscale(100%) brightness(1.5) contrast(200%)";
        }
        this.ctx.drawImage(this.playerImg, ship.x, floatY, ship.w, ship.h);
        this.ctx.restore();
    }

    /**
     * Dessine l'écran de Game Over en superposition.
     * @param {number} score - Score final de la partie.
     * @param {boolean} isContrast - Si le contraste renforcé est actif.
     * @param {boolean} isDyslexia - Si la police dyslexie est active.
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
