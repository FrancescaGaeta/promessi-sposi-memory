// --- CONFIGURAZIONE E LISTENER ---
document.getElementById("startGameBtn").addEventListener("click", openManuscript);

// Funzione per aprire il libro
function openManuscript() {
    const book = document.getElementById("book-element");
    const introOverlay = document.getElementById("intro-screen");
    const mainGame = document.getElementById("main-game");
    const level = document.getElementById("levelSelectIntro").value;

    // 1. Inizia l'animazione di rotazione 3D
    book.classList.add("open");

    // 2. Aspetta che il libro sia quasi aperto prima di sfumare l'overlay
    setTimeout(() => {
        introOverlay.classList.add("fade-out-overlay");
        
        // 3. Mostra la sezione gioco e inizializza
        setTimeout(() => {
            introOverlay.classList.add("hidden");
            mainGame.classList.remove("hidden");
            initGame(level); // Assicurati di avere questa funzione definita nel tuo script principale
        }, 800);
    }, 1000);
}

// --- LOGICA GESTIONE TESTI (Dalle tue specifiche) ---

function updateNarrator(title, quote) {
    const content = `<span class="char-title" style="font-size:0.9rem; color: #d4af37; display:block;">${title}</span> « ${quote} »`;
    
    const targets = [document.getElementById("message-top"), document.getElementById("message-bottom")];
    
    targets.forEach(el => {
        if(!el) return;
        el.style.opacity = 0; // Semplice effetto transizione
        setTimeout(() => {
            el.innerHTML = content;
            el.style.opacity = 1;
        }, 300);
    });
}

// Da inserire all'interno della tua funzione checkForMatch quando trovi una coppia
function handleMatchFound(name, quoteMap) {
    matches++;
    document.getElementById("matches").textContent = matches;
    
    // Aggiorna i pannelli con la citazione del personaggio
    updateNarrator(name, quoteMap[name] || "Un incontro memorabile...");

    // Logica per bloccare le carte (assumendo che firstCard e secondCard siano globali)
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    
    if (matches === totalPairs) handleVictory();
    resetTurn();
}

// Funzione fittizia per evitare errori nel test del codice sopra
function initGame(level) {
    console.log("Gioco inizializzato con livello:", level);
    // Qui andrà la tua logica esistente di generazione carte
}
