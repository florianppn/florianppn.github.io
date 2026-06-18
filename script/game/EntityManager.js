"use strict";

import { Ship } from "./Ship.js";
import { Asteroid } from "./Asteroid.js";
import { Laser } from "./Laser.js";
import { Particle } from "./Particle.js";
import { Star } from "./Star.js";

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
 * Classe gérant toutes les entités du jeu (vaisseau, étoiles, lasers, astéroïdes, particules) et leur physique.
 */
export class EntityManager {
    constructor(canvasWidth, canvasHeight, onShipCollision, onAsteroidDestroyed) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.onShipCollision = onShipCollision;
        this.onAsteroidDestroyed = onAsteroidDestroyed;

        this.ship = new Ship();
        this.lasers = [];
        this.asteroids = [];
        this.particles = [];
        this.stars = [];
    }

    /**
     * Réinitialise l'état des entités et régénère les étoiles.
     * @returns {void}
     */
    reset() {
        this.ship.y = 180;
        this.lasers = [];
        this.asteroids = [];
        this.particles = [];

        // Génération initiale des étoiles pour la parallaxe
        this.stars = [];
        for (let i = 0; i < 35; i++) {
            const size = 0.8 + Math.random() * 1.5;
            const speed = 0.3 + Math.random() * 1.2;
            this.stars.push(new Star(
                Math.random() * this.canvasWidth,
                Math.random() * this.canvasHeight,
                speed,
                size
            ));
        }
    }

    /**
     * Tire un projectile laser depuis l'avant du vaisseau.
     * @returns {void}
     */
    fireLaser() {
        this.lasers.push(new Laser(
            this.ship.x + this.ship.w,
            this.ship.y + this.ship.h / 2
        ));
    }

    /**
     * Crée une explosion de particules aux coordonnées indiquées.
     * @param {number} x - Coordonnée horizontale.
     * @param {number} y - Coordonnée verticale.
     * @param {boolean} isContrast - Si le mode contraste renforcé est actif.
     * @returns {void}
     */
    createExplosion(x, y, isContrast) {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3.5;
            const radius = 1 + Math.random() * 2;
            const decay = 0.02 + Math.random() * 0.03;
            const color = isContrast
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
     * Met à jour les positions, gère les collisions et fait apparaître les nouveaux éléments.
     * @param {number} frame - Numéro de la frame actuelle.
     * @param {number} score - Score actuel de la partie.
     * @param {boolean} isContrast - Si le mode contraste renforcé est actif.
     * @param {number} mouseY - Position verticale cible du vaisseau.
     * @returns {void}
     */
    update(frame, score, isContrast, mouseY) {
        // 1. Mise à jour des étoiles d'arrière-plan (parallaxe)
        this.stars.forEach(s => s.updateWithSpeed(1.0, this.canvasWidth, this.canvasHeight));

        // 2. Mise à jour de la position fluide du vaisseau
        this.ship.updatePosition(mouseY, this.canvasHeight);

        // 3. Génération des particules de traînée du réacteur
        if (frame % 3 === 0) {
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

        // 4. Tir automatique
        if (frame % 15 === 0) {
            this.fireLaser();
        }

        // 5. Déplacement et nettoyage des lasers hors-écran
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const l = this.lasers[i];
            l.update();
            if (l.isOutOfBounds(this.canvasWidth)) {
                this.lasers.splice(i, 1);
            }
        }

        // 6. Génération des obstacles (astéroïdes) avec difficulté croissante selon le score
        const speedMultiplier = Math.floor(score / 250);
        const spawnInterval = Math.max(35, 105 - speedMultiplier * 25);
        if (frame % spawnInterval === 0) {
            const radius = 24 + Math.floor(Math.random() * 14);
            const asteroidY = radius + Math.random() * (this.canvasHeight - radius * 2);
            const speed = 1.0 + Math.random() * 0.6 + speedMultiplier * 0.8;
            const tech = TECHS_TO_DODGE[Math.floor(Math.random() * TECHS_TO_DODGE.length)];
            
            // Décalages polygonaux aléatoires pour un rendu irrégulier
            const numPoints = 8;
            const offsets = [];
            for (let k = 0; k < numPoints; k++) {
                offsets.push((Math.random() - 0.5) * (radius * 0.35));
            }

            this.asteroids.push(new Asteroid(
                this.canvasWidth + radius,
                asteroidY,
                radius,
                speed,
                tech.name,
                tech.icon,
                offsets
            ));
        }

        // 7. Déplacement des astéroïdes et détection des collisions (avec lasers & joueur)
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

            // Collision avec le vaisseau (distance entre deux cercles)
            const distShip = Math.hypot(shipCx - a.x, shipCy - a.y);
            if (distShip < shipRadius + a.r) {
                this.onShipCollision();
                return;
            }

            // Collision avec les lasers (point dans un cercle)
            for (let j = this.lasers.length - 1; j >= 0; j--) {
                const l = this.lasers[j];
                const distLaser = Math.hypot(l.x - a.x, l.y - a.y);
                if (distLaser < a.r) {
                    this.createExplosion(a.x, a.y, isContrast);
                    this.lasers.splice(j, 1);
                    this.asteroids.splice(i, 1);

                    // Signalement de la destruction pour le score
                    this.onAsteroidDestroyed();
                    break;
                }
            }
        }

        // 8. Mise à jour et nettoyage des particules mortes
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
}
