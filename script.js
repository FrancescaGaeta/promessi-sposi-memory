 document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startGameBtn");
    const book = document.getElementById("book-element");
    const introOverlay = document.getElementById("intro-screen");
    const mainGame = document.getElementById("main-game");

    // GESTORE CLICK INIZIALE
    startBtn.addEventListener("click", () => {
        const level = document.getElementById("levelSelectIntro").value;
        
        // 1. Animazione apertura libro
        book.classList.add("open");

        // 2. Dissolvenza graduale dopo l'inizio dell'animazione
        setTimeout(() => {
            introOverlay.classList.add("fade-out");
            
            // 3. Mostra il gioco
            setTimeout(() => {
                introOverlay.classList.add("hidden");
                mainGame.classList.remove("hidden");
                
                // Inizializza il tuo gioco (passando il livello scelto)
                if (typeof initGame === "function") {
                    initGame(level);
                }
            }, 800);
        }, 1000);
    });
});

// Funzione Narratore (aggiornata con la tua logica)
function updateNarrator(title, quote) {
    const content = `<span style="color: #d4af37; font-size: 0.9rem;">${title}</span><br>« ${quote} »`;
    const panels = [document.getElementById("message-top"), document.getElementById("message-bottom")];
    
    panels.forEach(el => {
        if (!el) return;
        el.style.transition = "opacity 0.4s";
        el.style.opacity = 0;
        setTimeout(() => {
            el.innerHTML = content;
            el.style.opacity = 1;
        }, 400);
    });
}

// Esempio della tua funzione initGame (da completare con la tua logica di carte)
function initGame(level) {
    console.log("Gioco avviato a livello: " + level);
    // Qui inserisci il codice per generare la griglia del memory
}
