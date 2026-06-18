"use strict";

import { Entity } from "./Entity.js";

/**
 * Class representing a laser projectile fired by the player.
 */
export class Laser extends Entity {
    constructor(x, y, w = 12, h = 3, vx = 7) {
        super(x, y, w, h, vx, 0);
    }

    /**
     * Checks if the laser has left the canvas boundary.
     * @param {number} canvasWidth - Width limit of the canvas.
     * @returns {boolean}
     */
    isOutOfBounds(canvasWidth) {
        return this.x > canvasWidth;
    }
}
