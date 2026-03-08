"use strict";

/** Clés localStorage pour les préférences du widget accessibilité. */
const A11Y_STORAGE = { size: "a11y-text-size", contrast: "a11y-contrast", theme: "a11y-theme", dyslexia: "a11y-dyslexia" };

/**
 * Initialise le widget accessibilité : panneau (taille du texte, thème clair/sombre, contraste),
 * ouverture/fermeture au clic et Échap, persistance des préférences en localStorage.
 * @returns {void}
 */
export function initAccessibilityWidget() {
    const widget = document.getElementById("a11y-widget");
    const btn = document.getElementById("a11y-widget-btn");
    const panel = document.querySelector(".a11y-widget-panel");
    const sizeBtns = document.querySelectorAll(".a11y-size-btn");
    const contrastBtn = document.querySelector(".a11y-contrast-btn");
    const themeBtn = document.getElementById("a11y-theme-btn");
    const dyslexiaBtn = document.getElementById("a11y-dyslexia-btn");

    if (!widget || !btn || !panel) return;

    /** Affiche le panneau et met à jour aria-expanded. */
    function openPanel() {
        panel.removeAttribute("hidden");
        panel.classList.add("a11y-panel-open");
        btn.setAttribute("aria-expanded", "true");
    }

    /** Masque le panneau et met à jour aria-expanded. */
    function closePanel() {
        panel.setAttribute("hidden", "");
        panel.classList.remove("a11y-panel-open");
        btn.setAttribute("aria-expanded", "false");
    }

    /**
     * Bascule l'affichage du panneau (ouvrir/fermer).
     * @param {MouseEvent} e
     */
    function togglePanel(e) {
        e.preventDefault();
        e.stopPropagation();
        if (panel.hasAttribute("hidden")) openPanel();
        else closePanel();
    }

    document.addEventListener("click", (e) => {
        if (e.target.closest && e.target.closest("#a11y-widget-btn")) {
            togglePanel(e);
            return;
        }
        if (panel.hasAttribute("hidden")) return;
        if (widget && !widget.contains(e.target)) closePanel();
    }, true);


    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !panel.hasAttribute("hidden")) closePanel();
    });

    function setSize(size) {
        document.body.classList.remove("a11y-text-large", "a11y-text-xlarge");
        if (size === "large") document.body.classList.add("a11y-text-large");
        if (size === "xlarge") document.body.classList.add("a11y-text-xlarge");
        sizeBtns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.size === size ? "true" : "false"));
        try {
            localStorage.setItem(A11Y_STORAGE.size, size);
        } catch (_) {}
    }

    /**
     * Active ou désactive le mode contraste renforcé (classe sur body + localStorage).
     * À l'activation, force aussi le thème sombre pour rester cohérent avec la palette contraste.
     * @param {boolean} on
     */
    function setContrast(on) {
        if (on) {
            document.body.classList.add("a11y-contrast");
            setTheme(false);
        } else {
            document.body.classList.remove("a11y-contrast");
        }
        if (contrastBtn) {
            contrastBtn.setAttribute("aria-pressed", on ? "true" : "false");
            contrastBtn.textContent = on ? "Désactiver" : "Activer";
        }
        if (themeBtn) {
            themeBtn.disabled = on;
            themeBtn.setAttribute("aria-disabled", on ? "true" : "false");
        }
        try {
            localStorage.setItem(A11Y_STORAGE.contrast, on ? "1" : "0");
        } catch (_) {}
    }

    /**
     * Applique le thème clair ou sombre (classe theme-light sur body + localStorage).
     * @param {boolean} light - true = thème clair, false = thème sombre
     */
    function setTheme(light) {
        if (light) document.body.classList.add("theme-light");
        else document.body.classList.remove("theme-light");
        if (themeBtn) {
            themeBtn.setAttribute("aria-pressed", light);
            themeBtn.setAttribute("aria-label", light ? "Passer au thème sombre" : "Passer au thème clair");
            const icon = themeBtn.querySelector("i");
            const label = themeBtn.querySelector(".a11y-theme-label");
            if (icon) {
                icon.className = light ? "fa-solid fa-moon" : "fa-solid fa-sun";
                icon.setAttribute("aria-hidden", "true");
            }
            if (label) label.textContent = light ? "Thème sombre" : "Thème clair";
        }
        try {
            localStorage.setItem(A11Y_STORAGE.theme, light ? "1" : "0");
        } catch (_) {}
    }

    /**
     * Active ou désactive le mode dyslexie (police et espacements adaptés).
     * @param {boolean} on
     */
    function setDyslexia(on) {
        if (on) document.body.classList.add("a11y-dyslexia");
        else document.body.classList.remove("a11y-dyslexia");
        if (dyslexiaBtn) {
            dyslexiaBtn.setAttribute("aria-pressed", on ? "true" : "false");
            dyslexiaBtn.textContent = on ? "Désactiver" : "Activer";
        }
        try {
            localStorage.setItem(A11Y_STORAGE.dyslexia, on ? "1" : "0");
        } catch (_) {}
    }

    sizeBtns.forEach((b) => {
        b.addEventListener("click", () => setSize(b.dataset.size));
    });
    contrastBtn?.addEventListener("click", () => {
        setContrast(!document.body.classList.contains("a11y-contrast"));
    });
    themeBtn?.addEventListener("click", () => {
        if (themeBtn.disabled) return;
        setTheme(!document.body.classList.contains("theme-light"));
    });
    dyslexiaBtn?.addEventListener("click", () => {
        setDyslexia(!document.body.classList.contains("a11y-dyslexia"));
    });

    try {
        const savedSize = localStorage.getItem(A11Y_STORAGE.size);
        if (savedSize) setSize(savedSize);
        const savedContrast = localStorage.getItem(A11Y_STORAGE.contrast);
        if (savedContrast === "1") setContrast(true);
        const savedTheme = localStorage.getItem(A11Y_STORAGE.theme);
        if (savedTheme === "1" && !document.body.classList.contains("a11y-contrast")) setTheme(true);
        const savedDyslexia = localStorage.getItem(A11Y_STORAGE.dyslexia);
        if (savedDyslexia === "1") setDyslexia(true);
    } catch (_) {}
}
