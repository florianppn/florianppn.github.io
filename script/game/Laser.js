"use strict";

import { Entity } from "./Entity.js";

/**
 * Classe représentant un projectile laser tiré par le joueur.
 */
export class Laser extends Entity {
    constructor(x, y, w = 12, h = 3, vx = 7) {
        super(x, y, w, h, vx, 0);
    }

    /**
     * Vérifie si le laser a dépassé les limites du canvas.
     * @param {number} canvasWidth - Largeur limite du canvas.
     * @returns {boolean}
     */
    isOutOfBounds(canvasWidth) {
        return this.x > canvasWidth;
    }
}
