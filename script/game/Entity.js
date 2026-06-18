"use strict";

/**
 * Classe de base représentant toute entité physique sur l'écran.
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
     * Mise à jour standard déplaçant l'entité selon sa vitesse.
     * @returns {void}
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}
