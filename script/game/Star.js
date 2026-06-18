"use strict";

import { Entity } from "./Entity.js";

/**
 * Classe représentant une étoile d'arrière-plan avec effet de parallaxe.
 */
export class Star extends Entity {
    constructor(x, y, vx, size) {
        // Les étoiles se déplacent vers la gauche, la vitesse vx est négative
        super(x, y, size, size, -vx, 0);
        this.size = size;
        this.baseVx = vx;
    }

    /**
     * Met à jour la position de l'étoile selon un facteur de vitesse et gère le bouclage en bord d'écran.
     * @param {number} speedFactor - Facteur pour ralentir ou accélérer la dérive de l'étoile.
     * @param {number} canvasWidth - Largeur de l'écran pour le bouclage.
     * @param {number} canvasHeight - Hauteur de l'écran pour le repositionnement aléatoire.
     * @returns {void}
     */
    updateWithSpeed(speedFactor, canvasWidth, canvasHeight) {
        this.x -= this.baseVx * speedFactor;
        if (this.x < 0) {
            this.x = canvasWidth;
            this.y = Math.random() * canvasHeight;
        }
    }
}
