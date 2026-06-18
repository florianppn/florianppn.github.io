"use strict";

import { Entity } from "./Entity.js";

/**
 * Classe représentant le vaisseau spatial du joueur.
 */
export class Ship extends Entity {
    constructor(x = 45, y = 180, w = 36, h = 36) {
        super(x, y, w, h, 0, 0);
    }

    /**
     * Met à jour de manière fluide la position verticale en fonction de la cible mouseY.
     * @param {number} targetMouseY - La position verticale cible du curseur.
     * @param {number} canvasHeight - La hauteur de l'écran.
     * @returns {void}
     */
    updatePosition(targetMouseY, canvasHeight) {
        const targetY = Math.max(0, Math.min(canvasHeight - this.h, targetMouseY - this.h / 2));
        this.y += (targetY - this.y) * 0.16;
    }
}
