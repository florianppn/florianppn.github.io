"use strict";

import { Entity } from "./Entity.js";

/**
 * Classe représentant une particule pour les explosions ou les traînées du vaisseau.
 */
export class Particle extends Entity {
    constructor(x, y, vx, vy, r, color, alpha, life, decay) {
        super(x, y, r * 2, r * 2, vx, vy);
        this.r = r;
        this.color = color;
        this.alpha = alpha;
        this.life = life;
        this.decay = decay;
    }

    /**
     * Met à jour la position de la particule et réduit sa durée de vie.
     * @returns {void}
     */
    update() {
        super.update();
        this.life -= this.decay;
    }

    /**
     * Vérifie si la particule a terminé sa durée de vie.
     * @returns {boolean}
     */
    isDead() {
        return this.life <= 0;
    }
}
