"use strict";

const HIGHSCORE_KEY = "kickman-highscore";

/**
 * Class managing the game score, highscore, and their display.
 */
export class ScoreManager {
    constructor(scoreEl, highscoreEl) {
        this.scoreEl = scoreEl;
        this.highscoreEl = highscoreEl;
        this.score = 0;
        this.highscore = parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10);
        this.lastSpeedMultiplier = 0;
    }

    /**
     * Initializes the highscore display.
     * @returns {void}
     */
    init() {
        this.highscoreEl.textContent = this.highscore.toString();
    }

    /**
     * Resets current score.
     * @returns {void}
     */
    reset() {
        this.score = 0;
        this.scoreEl.textContent = "0";
        this.lastSpeedMultiplier = 0;
    }

    /**
     * Adds score points and updates highscore if applicable.
     * @param {number} points - Points to add.
     * @returns {boolean} - True if a new speed wave threshold has been crossed.
     */
    addScore(points) {
        this.score += points;
        this.scoreEl.textContent = this.score.toString();

        if (this.score > this.highscore) {
            this.highscore = this.score;
            this.highscoreEl.textContent = this.highscore.toString();
            try {
                localStorage.setItem(HIGHSCORE_KEY, this.highscore.toString());
            } catch {
                // Ignore storage errors
            }
        }

        const currentMultiplier = Math.floor(this.score / 250);
        if (currentMultiplier > this.lastSpeedMultiplier) {
            this.lastSpeedMultiplier = currentMultiplier;
            return true;
        }
        return false;
    }

    /**
     * Getter for current score.
     * @returns {number}
     */
    getScore() {
        return this.score;
    }

    /**
     * Getter for highscore.
     * @returns {number}
     */
    getHighscore() {
        return this.highscore;
    }
}
