"use strict";

/**
 * Initialise l'effet de machine à écrire sur le code du terminal du profil.
 * Sépare le texte par caractère tout en préservant la structure HTML originelle
 * (et donc la coloration syntaxique).
 * @returns {void}
 */
export function initTypewriter() {
    const terminal = document.querySelector('.terminal');
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminal || !terminalBody) return;

    // Ajouter la classe pour indiquer que le mode machine à écrire JS est actif
    terminal.classList.add('js-typewriter');

    const lines = Array.from(terminalBody.querySelectorAll('.terminal-line:not(.terminal-cursor-line)'));
    const finalCursorLine = terminalBody.querySelector('.terminal-cursor-line');

    // Cacher la ligne du curseur de fin pendant la saisie
    if (finalCursorLine) {
        finalCursorLine.style.opacity = '0';
    }

    // Préparer les données de chaque ligne en extrayant les nœuds de texte
    const lineData = lines.map(line => {
        const textNodes = [];
        const walk = document.createTreeWalker(line, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walk.nextNode()) {
            textNodes.push({
                node: node,
                originalText: node.nodeValue
            });
            // Vider temporairement le texte du nœud
            node.nodeValue = '';
        }

        // Cacher la ligne initialement pour qu'elle n'apparaisse que lorsqu'on commence à la taper
        line.style.opacity = '0';

        return {
            element: line,
            textNodes: textNodes
        };
    });

    // Créer le curseur de frappe temporaire
    const typingCursor = document.createElement('span');
    typingCursor.className = 'terminal-cursor';

    let currentLineIndex = 0;
    let currentTextNodeIndex = 0;
    let currentCharIndex = 0;

    function typeNextChar() {
        // Si toutes les lignes ont été saisies
        if (currentLineIndex >= lineData.length) {
            // Supprimer le curseur de frappe de la dernière ligne
            if (typingCursor.parentNode) {
                typingCursor.parentNode.removeChild(typingCursor);
            }
            // Afficher le curseur clignotant final
            if (finalCursorLine) {
                finalCursorLine.style.opacity = '1';
            }
            return;
        }

        const currentLine = lineData[currentLineIndex];

        // Rendre la ligne visible et attacher le curseur au début de la ligne si nécessaire
        if (currentLine.element.style.opacity === '0') {
            currentLine.element.style.opacity = '1';
            currentLine.element.appendChild(typingCursor);
        }

        const nodes = currentLine.textNodes;

        // Gérer le cas d'une ligne complètement vide (sans nœuds de texte)
        if (nodes.length === 0) {
            setTimeout(() => {
                currentLineIndex++;
                typeNextChar();
            }, 100);
            return;
        }

        // Si tous les nœuds de texte de la ligne actuelle sont saisis
        if (currentTextNodeIndex >= nodes.length) {
            // Petite pause avant de passer à la ligne suivante
            currentLineIndex++;
            currentTextNodeIndex = 0;
            currentCharIndex = 0;
            setTimeout(typeNextChar, 180);
            return;
        }

        const currentNodeData = nodes[currentTextNodeIndex];
        const text = currentNodeData.originalText;

        if (currentCharIndex < text.length) {
            const char = text[currentCharIndex];
            currentNodeData.node.nodeValue += char;
            currentCharIndex++;

            // Simulation d'une frappe humaine :
            // Un peu plus rapide pour les espaces ou retours à la ligne,
            // et un léger délai aléatoire pour le reste des caractères.
            let delay = 20;
            if (char === ' ' || char === '\u00A0') {
                delay = 10;
            } else {
                delay = 15 + Math.random() * 20; // Entre 15ms et 35ms
            }

            setTimeout(typeNextChar, delay);
        } else {
            // Passer au nœud de texte suivant de la même ligne
            currentTextNodeIndex++;
            currentCharIndex = 0;
            typeNextChar();
        }
    }

    // Lancer la saisie après un court délai d'introduction (ex: 400ms)
    setTimeout(typeNextChar, 400);
}
