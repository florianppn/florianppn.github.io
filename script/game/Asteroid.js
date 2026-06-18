"use strict";

import { Entity } from "./Entity.js";

/**
 * Class representing a technology asteroid obstacle.
 */
export class Asteroid extends Entity {
    constructor(x, y, radius, speed, techName, techIcon, offsets) {
        // Asteroids move leftwards, so velocity is negative
        super(x, y, radius * 2, radius * 2, -speed, 0);
        this.r = radius;
        this.techName = techName;
        this.techIcon = techIcon;
        this.angle = 0;
        this.spinSpeed = (Math.random() - 0.5) * 0.03;
        this.offsets = offsets;
    }

    /**
     * Updates position and rotates the asteroid.
     * @returns {void}
     */
    update() {
        super.update();
        this.angle += this.spinSpeed;
    }

    /**
     * Checks if the asteroid has completely left the screen to the left.
     * @returns {boolean}
     */
    isOutOfBounds() {
        return this.x + this.r < 0;
    }
}
