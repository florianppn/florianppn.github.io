"use strict";

const A11Y_STORAGE = { size: "a11y-text-size", contrast: "a11y-contrast" };

/**
 * Widget accessibilité : taille du texte + contraste renforcé
 */
export function initAccessibilityWidget() {
    const widget = document.getElementById("a11y-widget");
    const btn = document.getElementById("a11y-widget-btn");
    const panel = document.querySelector(".a11y-widget-panel");
    const sizeBtns = document.querySelectorAll(".a11y-size-btn");
    const contrastBtn = document.querySelector(".a11y-contrast-btn");

    if (!widget || !btn || !panel) return;

    function openPanel() {
        panel.removeAttribute("hidden");
        panel.classList.add("a11y-panel-open");
        btn.setAttribute("aria-expanded", "true");
    }

    function closePanel() {
        panel.setAttribute("hidden", "");
        panel.classList.remove("a11y-panel-open");
        btn.setAttribute("aria-expanded", "false");
    }

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
        sizeBtns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.size === size));
        try {
            localStorage.setItem(A11Y_STORAGE.size, size);
        } catch (_) {}
    }

    function setContrast(on) {
        if (on) document.body.classList.add("a11y-contrast");
        else document.body.classList.remove("a11y-contrast");
        if (contrastBtn) {
            contrastBtn.setAttribute("aria-pressed", on);
            contrastBtn.textContent = on ? "Désactiver" : "Activer";
        }
        try {
            localStorage.setItem(A11Y_STORAGE.contrast, on ? "1" : "0");
        } catch (_) {}
    }

    sizeBtns.forEach((b) => {
        b.addEventListener("click", () => setSize(b.dataset.size));
    });
    contrastBtn?.addEventListener("click", () => {
        setContrast(!document.body.classList.contains("a11y-contrast"));
    });

    try {
        const savedSize = localStorage.getItem(A11Y_STORAGE.size);
        if (savedSize) setSize(savedSize);
        const savedContrast = localStorage.getItem(A11Y_STORAGE.contrast);
        if (savedContrast === "1") setContrast(true);
    } catch (_) {}
}
