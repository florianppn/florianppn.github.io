"use strict";

import { Entity } from "./Entity.js";

/**
 * Class representing a parallax background star.
 */
export class Star extends Entity {
    constructor(x, y, vx, size) {
        // Stars move leftwards, so velocity vx is negative
        super(x, y, size, size, -vx, 0);
        this.size = size;
        this.baseVx = vx;
    }

    /**
     * Updates star position with speed factor and handles wrap-around.
     * @param {number} speedFactor - Factor to slow down or speed up star drift.
     * @param {number} canvasWidth - Width of screen for wrap-around.
     * @param {number} canvasHeight - Height of screen for random positioning.
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
