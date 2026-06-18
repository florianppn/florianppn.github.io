"use strict";

import { Entity } from "./Entity.js";

/**
 * Class representing the player's spaceship.
 */
export class Ship extends Entity {
    constructor(x = 45, y = 180, w = 36, h = 36) {
        super(x, y, w, h, 0, 0);
    }

    /**
     * Smoothly updates vertical position based on mouseY target.
     * @param {number} targetMouseY - The cursor vertical target position.
     * @param {number} canvasHeight - Height of the screen.
     * @returns {void}
     */
    updatePosition(targetMouseY, canvasHeight) {
        const targetY = Math.max(0, Math.min(canvasHeight - this.h, targetMouseY - this.h / 2));
        this.y += (targetY - this.y) * 0.16;
    }
}
