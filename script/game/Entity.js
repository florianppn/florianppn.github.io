"use strict";

/**
 * Base class representing any physical entity on the screen.
 */
export class Entity {
    constructor(x, y, w, h, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
    }

    /**
     * Standard update moving the entity according to its velocity.
     * @returns {void}
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}
