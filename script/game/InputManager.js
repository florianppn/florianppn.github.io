"use strict";

/**
 * Class managing keyboard, mouse, and touch inputs.
 */
export class InputManager {
    /**
     * @param {HTMLCanvasElement} canvas - The drawing canvas.
     * @param {function(string): void} onAction - Callback for general action triggers ('click', 'up', 'down', 'action').
     */
    constructor(canvas, onAction) {
        this.canvas = canvas;
        this.onAction = onAction;
        this.mouseY = 180;

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    /**
     * Attaches all input event listeners.
     * @returns {void}
     */
    init() {
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
        this.canvas.addEventListener("click", this.handleCanvasClick);
        window.addEventListener("keydown", this.handleKeyDown);
    }

    /**
     * Removes all input event listeners.
     * @returns {void}
     */
    destroy() {
        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvas.removeEventListener("touchmove", this.handleTouchMove);
        this.canvas.removeEventListener("click", this.handleCanvasClick);
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    /**
     * Resets input state coordinates.
     * @returns {void}
     */
    reset() {
        this.mouseY = 180;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseY = e.clientY - rect.top;
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.mouseY = e.touches[0].clientY - rect.top;
        }
    }

    handleCanvasClick(e) {
        e.stopPropagation();
        this.onAction("click");
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if (key === "arrowup" || key === "z") {
            e.preventDefault();
            this.onAction("up");
        } else if (key === "arrowdown" || key === "s") {
            e.preventDefault();
            this.onAction("down");
        } else if (key === " " || key === "enter") {
            e.preventDefault();
            this.onAction("action");
        }
    }
}
