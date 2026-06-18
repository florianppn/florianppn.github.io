"use strict";

import { Entity } from "./Entity.js";

/**
 * Class representing a particle for explosions or ship trails.
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
     * Updates particle position and decays its life.
     * @returns {void}
     */
    update() {
        super.update();
        this.life -= this.decay;
    }

    /**
     * Checks if the particle has completed its lifespan.
     * @returns {boolean}
     */
    isDead() {
        return this.life <= 0;
    }
}
