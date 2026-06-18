"use strict";

const HIGHSCORE_KEY = "kickman-highscore";
const TECHS_TO_DODGE = ["COBOL", "Python", "PHP", "Symfony", "Ruby", "C++", "Rust", "Perl", "WordPress", "Fortran", "Basic", "Delphi"];

/**
 * Initialise le mini-jeu "Flappy Kickman" déclenché secrètement par 5 clics rapides sur le logo.
 * @returns {void}
 */
export function initGame() {
    const logo = document.querySelector(".menu-container .logo");
    const gameModal = document.getElementById("game-modal");
    const closeGameBtn = document.getElementById("close-game");
    const gameBackdrop = document.getElementById("game-backdrop");
    const canvas = document.getElementById("game-canvas");
    const scoreEl = document.getElementById("game-score");
    const highscoreEl = document.getElementById("game-highscore");
    const startBtn = document.getElementById("start-game-btn");

    if (!logo || !gameModal || !canvas || !scoreEl || !highscoreEl || !startBtn) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Chargement de l'image du joueur (logo du site)
    const playerImg = new Image();
    playerImg.src = "./asset/logo/kickman.png";

    // Variables de jeu
    let state = "idle"; // idle, playing, gameover
    let score = 0;
    let highscore = parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10);
    let animationFrameId = null;
    let frame = 0;
    let pipes = [];

    // Paramètres du joueur
    const bird = {
        x: 60,
        y: 180,
        w: 32,
        h: 32,
        vy: 0,
        g: 0.28,
        jump: -5.8
    };

    highscoreEl.textContent = highscore.toString();

    // Détection des 5 clics rapides sur le logo
    let logoClicks = 0;
    let lastClickTime = 0;

    logo.addEventListener("click", () => {
        const now = Date.now();
        if (now - lastClickTime < 1000) {
            logoClicks++;
        } else {
            logoClicks = 1;
        }
        lastClickTime = now;

        if (logoClicks === 5) {
            openGame();
            logoClicks = 0;
        }
    });

    function openGame() {
        gameModal.removeAttribute("hidden");
        gameModal.classList.add("is-open");
        resetGame();
        drawIdle();
        window.addEventListener("keydown", handleGlobalKeys);
    }

    function closeGame() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        state = "idle";
        gameModal.setAttribute("hidden", "");
        gameModal.classList.remove("is-open");
        window.removeEventListener("keydown", handleGlobalKeys);
    }

    closeGameBtn.addEventListener("click", closeGame);
    gameBackdrop.addEventListener("click", closeGame);

    function resetGame() {
        state = "idle";
        score = 0;
        scoreEl.textContent = "0";
        bird.y = 180;
        bird.vy = 0;
        pipes = [];
        frame = 0;
    }

    function startGame() {
        resetGame();
        state = "playing";
        startBtn.style.display = "none";
        loop();
    }

    startBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        startGame();
    });

    function jump() {
        if (state === "playing") {
            bird.vy = bird.jump;
        } else if (state === "idle") {
            startGame();
        } else if (state === "gameover") {
            startGame();
        }
    }

    canvas.addEventListener("click", (e) => {
        e.stopPropagation();
        jump();
    });

    function handleGlobalKeys(e) {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            jump();
        }
    }

    // Boucle de jeu principale
    function loop() {
        if (state !== "playing") return;

        update();
        render();

        frame++;
        animationFrameId = requestAnimationFrame(loop);
    }

    function update() {
        // Application de la gravité sur l'oiseau
        bird.vy += bird.g;
        bird.y += bird.vy;

        // Collision avec le sol ou le plafond
        if (bird.y + bird.h >= canvas.height) {
            bird.y = canvas.height - bird.h;
            gameOver();
            return;
        }
        if (bird.y <= 0) {
            bird.y = 0;
            bird.vy = 0.5; // léger rebond vers le bas
        }

        // Gestion des obstacles (tuyaux)
        // Générer un nouveau tuyau tous les 110 frames
        if (frame % 110 === 0) {
            const gap = 125;
            const minHeight = 40;
            const maxHeight = canvas.height - gap - minHeight;
            const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
            const techName = TECHS_TO_DODGE[Math.floor(Math.random() * TECHS_TO_DODGE.length)];

            pipes.push({
                x: canvas.width,
                w: 64,
                topHeight: topHeight,
                bottomY: topHeight + gap,
                techName: techName,
                passed: false
            });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            const p = pipes[i];
            p.x -= 2; // Vitesse de défilement

            // Suppression du tuyau s'il sort de l'écran
            if (p.x + p.w < 0) {
                pipes.splice(i, 1);
                continue;
            }

            // Détection de collision (AABB)
            if (bird.x + bird.w > p.x && bird.x < p.x + p.w) {
                // Collision avec le tuyau supérieur ou inférieur
                if (bird.y < p.topHeight || bird.y + bird.h > p.bottomY) {
                    gameOver();
                    return;
                }
            }

            // Incrémentation du score
            if (!p.passed && p.x + p.w / 2 < bird.x) {
                p.passed = true;
                score++;
                scoreEl.textContent = score.toString();

                if (score > highscore) {
                    highscore = score;
                    highscoreEl.textContent = highscore.toString();
                    try {
                        localStorage.setItem(HIGHSCORE_KEY, highscore.toString());
                    } catch {
                        // ignore
                    }
                }
            }
        }
    }

    function render() {
        // Effacement avec le fond du site
        ctx.fillStyle = "#0A1826";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessin d'une grille décorative en arrière-plan
        ctx.strokeStyle = "rgba(23, 133, 130, 0.08)";
        ctx.lineWidth = 1;
        const gridSize = 25;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Dessin des obstacles
        pipes.forEach((p) => {
            const grad = ctx.createLinearGradient(p.x, 0, p.x + p.w, 0);
            grad.addColorStop(0, "#131f2b");
            grad.addColorStop(1, "#0d2130");

            // Dessin du tuyau du haut
            ctx.fillStyle = grad;
            ctx.strokeStyle = "rgba(23, 133, 130, 0.4)";
            ctx.lineWidth = 2;
            ctx.fillRect(p.x, 0, p.w, p.topHeight);
            ctx.strokeRect(p.x, -2, p.w, p.topHeight + 2);

            // Dessin du tuyau du bas
            ctx.fillRect(p.x, p.bottomY, p.w, canvas.height - p.bottomY);
            ctx.strokeRect(p.x, p.bottomY, p.w, canvas.height - p.bottomY + 2);

            // Dessin des étiquettes technologiques
            ctx.fillStyle = "#BFA181"; // Couleur or
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Écriture du nom de la techno sur le tuyau supérieur (en bas du tuyau)
            if (p.topHeight > 25) {
                ctx.fillText(p.techName, p.x + p.w / 2, p.topHeight - 15);
            }
            // Écriture sur le tuyau inférieur (en haut du tuyau)
            if (canvas.height - p.bottomY > 25) {
                ctx.fillText(p.techName, p.x + p.w / 2, p.bottomY + 15);
            }
        });

        // Dessin du joueur (logo Kickman)
        ctx.save();
        ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
        // Inclinaison de l'oiseau selon la vitesse
        const angle = Math.min(Math.max(bird.vy * 0.08, -0.4), 0.6);
        ctx.rotate(angle);
        ctx.drawImage(playerImg, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
        ctx.restore();
    }

    function drawIdle() {
        ctx.fillStyle = "#0A1826";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#BFA181";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY KICKMAN", canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = "14px sans-serif";
        ctx.fillText("Prêt à esquiver le COBOL ?", canvas.width / 2, canvas.height / 2 + 10);
        
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "rgba(191, 161, 129, 0.7)";
        ctx.fillText("Cliquez sur le canvas pour sauter", canvas.width / 2, canvas.height / 2 + 50);

        // Dessin de l'oiseau immobile au centre
        ctx.drawImage(playerImg, canvas.width / 2 - 16, canvas.height / 2 - 16, 32, 32);
        startBtn.style.display = "inline-block";
        startBtn.textContent = "Lancer la partie";
    }

    function gameOver() {
        state = "gameover";
        startBtn.style.display = "inline-block";
        startBtn.textContent = "Recommencer";

        ctx.fillStyle = "rgba(10, 24, 38, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff4a4a";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30);

        ctx.fillStyle = "#BFA181";
        ctx.font = "14px sans-serif";
        ctx.fillText(`Score final : ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    }
}
