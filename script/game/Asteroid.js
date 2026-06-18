"use strict";

import { Entity } from "./Entity.js";

/**
 * Classe représentant un astéroïde technologique faisant office d'obstacle.
 */
export class Asteroid extends Entity {
    constructor(x, y, radius, speed, techName, techIcon, offsets) {
        // Les astéroïdes se déplacent vers la gauche, donc la vitesse vx est négative
        super(x, y, radius * 2, radius * 2, -speed, 0);
        this.r = radius;
        this.techName = techName;
        this.techIcon = techIcon;
        this.angle = 0;
        this.spinSpeed = (Math.random() - 0.5) * 0.03;
        this.offsets = offsets;
    }

    /**
     * Met à jour la position et fait tourner l'astéroïde.
     * @returns {void}
     */
    update() {
        super.update();
        this.angle += this.spinSpeed;
    }

    /**
     * Vérifie si l'astéroïde est complètement sorti de l'écran par la gauche.
     * @returns {boolean}
     */
    isOutOfBounds() {
        return this.x + this.r < 0;
    }
}
