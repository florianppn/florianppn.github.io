"use strict";

const HIGHSCORE_KEY = "kickman-highscore";
const TECHS_TO_DODGE = [
    { name: "Java", icon: "\uf4e4" },
    { name: "Python", icon: "\uf3e2" },
    { name: "PHP", icon: "\uf457" },
    { name: "Symfony", icon: "\uf83d" },
    { name: "Rust", icon: "\ue07a" },
    { name: "WordPress", icon: "\uf411" },
    { name: "Angular", icon: "\uf420" },
    { name: "React", icon: "\uf41b" },
    { name: "NodeJS", icon: "\uf3d3" },
    { name: "Docker", icon: "\uf395" },
    { name: "HTML5", icon: "\uf13b" },
    { name: "CSS3", icon: "\uf38b" },
    { name: "JS", icon: "\uf3b8" },
    { name: "Git", icon: "\uf1d3" },
    { name: "Android", icon: "\uf17b" },
    { name: "Apple", icon: "\uf179" },
    { name: "Linux", icon: "\uf17c" }
];

/**
 * Initialise le déclencheur secret de 5 clics sur le logo dans la navbar.
 * Fait vibrer le logo à chaque clic et redirige vers la page dédiée game.html au bout de 5 clics.
 * @returns {void}
 */
export function initGameTrigger() {
    const logo = document.querySelector(".menu-container .logo");
    if (!logo) return;

    let logoClicks = 0;
    let lastClickTime = 0;

    logo.addEventListener("click", (e) => {
        e.preventDefault();

        // Déclenche l'animation de vibration/wiggle
        logo.classList.remove("clicked-hint");
        void logo.offsetWidth; // Force le reflow
        logo.classList.add("clicked-hint");

        const now = Date.now();
        if (now - lastClickTime < 1000) {
            logoClicks++;
        } else {
            logoClicks = 1;
        }
        lastClickTime = now;

        if (logoClicks === 5) {
            window.location.href = "./game.html";
            logoClicks = 0;
        }
    });
}

/**
 * Moteur de jeu autonome pour "Space Kickman" fonctionnant sur game.html.
 * @returns {void}
 */
export function runSpaceGame() {
    const canvas = document.getElementById("game-canvas");
    const scoreEl = document.getElementById("game-score");
    const highscoreEl = document.getElementById("game-highscore");
    const startBtn = document.getElementById("start-game-btn");

    if (!canvas || !scoreEl || !highscoreEl || !startBtn) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Chargement de l'image du joueur (logo du site)
    const playerImg = new Image();
    playerImg.src = "./asset/logo/kickman.png";

    // Variables de jeu
    let state = "idle"; // idle, playing, gameover
    let score = 0;
    let highscore = parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10);
    let frame = 0;
    let lasers = [];
    let asteroids = [];
    let particles = [];
    let stars = [];
    let mouseY = 180;

    // Paramètres du vaisseau
    const ship = {
        x: 45,
        y: 180,
        w: 36,
        h: 36
    };

    highscoreEl.textContent = highscore.toString();

    // Enregistrement des événements sur la page
    window.addEventListener("keydown", handleGlobalKeys);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouseY = e.clientY - rect.top;
    }

    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            e.preventDefault(); // Empêche le défilement de la page sur mobile
            const rect = canvas.getBoundingClientRect();
            mouseY = e.touches[0].clientY - rect.top;
        }
    }

    function resetGame() {
        state = "idle";
        score = 0;
        scoreEl.textContent = "0";
        ship.y = 180;
        lasers = [];
        asteroids = [];
        particles = [];
        frame = 0;
        mouseY = 180;

        // Génération initiale des étoiles pour le parallaxe
        stars = [];
        for (let i = 0; i < 35; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 0.3 + Math.random() * 1.2,
                size: 0.8 + Math.random() * 1.5
            });
        }
    }

    function startGame() {
        resetGame();
        state = "playing";
        startBtn.style.display = "none";
        startBtn.blur();
    }

    startBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        startGame();
    });

    function fireLaser() {
        lasers.push({
            x: ship.x + ship.w,
            y: ship.y + ship.h / 2,
            w: 12,
            h: 3,
            vx: 7
        });
    }

    canvas.addEventListener("click", (e) => {
        e.stopPropagation();
        if (state === "playing") {
            fireLaser();
        } else if (state === "idle" || state === "gameover") {
            startGame();
        }
    });

    // Écouteur global pour clavier
    function handleGlobalKeys(e) {
        if (state === "playing") {
            if (e.key === "ArrowUp" || e.key === "z" || e.key === "Z") {
                e.preventDefault();
                mouseY = Math.max(ship.h / 2, mouseY - 20);
            } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
                e.preventDefault();
                mouseY = Math.min(canvas.height - ship.h / 2, mouseY + 20);
            } else if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                fireLaser();
            }
        } else if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            startGame();
        }
    }

    // Boucle de jeu principale
    function loop() {
        if (state === "playing") {
            update();
            render();
            frame++;
            requestAnimationFrame(loop);
        } else if (state === "idle") {
            // Défilement ralenti des étoiles en fond
            stars.forEach(s => {
                s.x -= s.vx * 0.2;
                if (s.x < 0) s.x = canvas.width;
            });
            drawIdle();
            frame++;
            requestAnimationFrame(loop);
        } else if (state === "gameover") {
            // Dérive lente des étoiles et astéroïdes restants
            stars.forEach(s => {
                s.x -= s.vx * 0.1;
                if (s.x < 0) s.x = canvas.width;
            });
            asteroids.forEach(a => {
                a.x += a.vx * 0.2;
                a.angle += a.spinSpeed * 0.2;
            });
            render();

            // Overlay de Game Over
            ctx.fillStyle = "rgba(10, 24, 38, 0.8)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#ff4a4a";
            ctx.font = "bold 26px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30);

            ctx.fillStyle = "#BFA181";
            ctx.font = "16px sans-serif";
            ctx.fillText(`Score final : ${score} pts`, canvas.width / 2, canvas.height / 2 + 15);

            frame++;
            requestAnimationFrame(loop);
        }
    }

    function update() {
        // 1. Déplacement des étoiles (Arrière-plan)
        stars.forEach(s => {
            s.x -= s.vx;
            if (s.x < 0) {
                s.x = canvas.width;
                s.y = Math.random() * canvas.height;
            }
        });

        // 2. Déplacement du vaisseau avec effet d'amorti (glissement fluide vers la souris)
        const targetY = Math.max(0, Math.min(canvas.height - ship.h, mouseY - ship.h / 2));
        ship.y += (targetY - ship.y) * 0.16;

        // 3. Particules d'échappement réacteur
        if (frame % 3 === 0) {
            particles.push({
                x: ship.x,
                y: ship.y + ship.h / 2 + (Math.random() - 0.5) * 6,
                vx: -1.5 - Math.random() * 1.5,
                vy: (Math.random() - 0.5) * 0.6,
                r: 1 + Math.random() * 1.5,
                color: Math.random() > 0.4 ? "#FF5E3A" : "#BFA181",
                alpha: 0.8,
                life: 0.6,
                decay: 0.03
            });
        }

        // 4. Auto-tir toutes les 15 frames (~250ms)
        if (frame % 15 === 0) {
            fireLaser();
        }

        // 5. Mise à jour des lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
            const l = lasers[i];
            l.x += l.vx;
            // Supprimer le laser s'il sort du canvas
            if (l.x > canvas.width) {
                lasers.splice(i, 1);
            }
        }

        // 6. Génération et mise à jour des astéroïdes
        const spawnInterval = Math.max(35, 80 - Math.floor(score / 50) * 4);
        if (frame % spawnInterval === 0) {
            const radius = 24 + Math.floor(Math.random() * 14); // Rayon entre 24 et 37
            const asteroidY = radius + Math.random() * (canvas.height - radius * 2);
            const speed = 1.6 + Math.random() * 1.2 + Math.min(1.5, score * 0.004);
            const tech = TECHS_TO_DODGE[Math.floor(Math.random() * TECHS_TO_DODGE.length)];
            
            // Génération de points irréguliers pour le rendu rocailleux
            const numPoints = 8;
            const offsets = [];
            for (let k = 0; k < numPoints; k++) {
                offsets.push((Math.random() - 0.5) * (radius * 0.35));
            }

            asteroids.push({
                x: canvas.width + radius,
                y: asteroidY,
                r: radius,
                vx: -speed,
                techName: tech.name,
                techIcon: tech.icon,
                angle: 0,
                spinSpeed: (Math.random() - 0.5) * 0.03,
                offsets: offsets
            });
        }

        // 7. Déplacement et collisions des astéroïdes
        const shipRadius = 15;
        const shipCx = ship.x + ship.w / 2;
        
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const a = asteroids[i];
            a.x += a.vx;
            a.angle += a.spinSpeed;

            // Sortie d'écran
            if (a.x + a.r < 0) {
                asteroids.splice(i, 1);
                continue;
            }

            // Collision avec le vaisseau (cercle à cercle)
            const shipCy = ship.y + ship.h / 2;
            const distShip = Math.hypot(shipCx - a.x, shipCy - a.y);
            if (distShip < shipRadius + a.r) {
                gameOver();
                return;
            }

            // Collision avec les lasers (point à cercle)
            for (let j = lasers.length - 1; j >= 0; j--) {
                const l = lasers[j];
                const distLaser = Math.hypot(l.x - a.x, l.y - a.y);
                if (distLaser < a.r) {
                    // Explosion de débris (particules)
                    createExplosion(a.x, a.y);

                    // Supprimer laser et astéroïde
                    lasers.splice(j, 1);
                    asteroids.splice(i, 1);

                    // Augmentation du score
                    score += 10;
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
                    break; // Sort de la boucle des lasers pour cet astéroïde
                }
            }
        }

        // 8. Mise à jour des particules
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    function createExplosion(x, y) {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3.5;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed - 0.5,
                vy: Math.sin(angle) * speed,
                r: 1 + Math.random() * 2,
                color: Math.random() > 0.5 ? "#FF5E3A" : "#178582",
                alpha: 1.0,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03
            });
        }
    }

    function render() {
        // Nettoyer avec le fond
        ctx.fillStyle = "#0A1826";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessiner les étoiles
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        stars.forEach(s => {
            ctx.fillRect(s.x, s.y, s.size, s.size);
        });

        // Dessiner les lasers
        ctx.fillStyle = "#FF5E3A";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#FF5E3A";
        lasers.forEach(l => {
            ctx.fillRect(l.x, l.y - l.h / 2, l.w, l.h);
        });
        ctx.shadowBlur = 0; // reset

        // Dessiner les astéroïdes
        asteroids.forEach(a => {
            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.rotate(a.angle);
            
            ctx.beginPath();
            const numPoints = 8;
            for (let k = 0; k < numPoints; k++) {
                const angle = (k / numPoints) * Math.PI * 2;
                const dist = a.r + a.offsets[k];
                const px = Math.cos(angle) * dist;
                const py = Math.sin(angle) * dist;
                if (k === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();

            ctx.fillStyle = "#12202E";
            ctx.fill();
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#178582";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#178582";
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Icône de la techno (FontAwesome)
            ctx.fillStyle = "#BFA181";
            const iconSize = Math.round(a.r * 0.9);
            ctx.font = `${iconSize}px 'Font Awesome 6 Brands'`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(a.techIcon, 0, 0);

            ctx.restore();
        });

        // Dessiner les particules
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Dessiner le vaisseau joueur (avec une petite inclinaison selon son déplacement)
        ctx.save();
        ctx.translate(ship.x + ship.w / 2, ship.y + ship.h / 2);
        
        // Légère inclinaison selon le décalage vers le haut/bas
        const diffY = (mouseY - ship.h / 2) - ship.y;
        const angle = Math.min(Math.max(diffY * 0.005, -0.25), 0.25);
        ctx.rotate(angle);
        
        ctx.drawImage(playerImg, -ship.w / 2, -ship.h / 2, ship.w, ship.h);
        ctx.restore();
    }

    function drawIdle() {
        // Réinitialisation et arrière-plan
        ctx.fillStyle = "#0A1826";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessiner les étoiles
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        stars.forEach(s => {
            ctx.fillRect(s.x, s.y, s.size, s.size);
        });

        ctx.fillStyle = "#BFA181";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SPACE KICKMAN", canvas.width / 2, canvas.height / 2 - 50);

        // Dessiner le vaisseau au centre-gauche flottant doucement
        const floatY = canvas.height / 2 - ship.h / 2 + Math.sin(frame * 0.05) * 6;
        ctx.drawImage(playerImg, ship.x, floatY, ship.w, ship.h);
    }

    function gameOver() {
        state = "gameover";
        startBtn.style.display = "inline-block";
        startBtn.textContent = "Recommencer";
    }

    // Lancer automatiquement la boucle de rendu pour l'état idle
    resetGame();
    loop();
}
