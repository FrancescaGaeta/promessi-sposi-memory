// Aggiungiamo i listener per l'apertura
document.getElementById("startGameBtn").addEventListener("click", openManuscript);

function openManuscript() {
    const level = document.getElementById("levelSelectIntro").value;
    document.getElementById("intro-screen").classList.add("fade-out");
    document.getElementById("main-game").classList.remove("hidden");
    initGame(level);
}

// Funzione aggiornata per scrivere in ENTRAMBI i pannelli
function updateNarrator(title, quote) {
    const content = `<span class="char-title" style="font-size:0.9rem">${title}</span> ${quote}`;
    
    [document.getElementById("message-top"), document.getElementById("message-bottom")].forEach(el => {
        el.classList.remove("fade-in");
        void el.offsetWidth;
        el.innerHTML = content;
        el.classList.add("fade-in");
    });
}

// Modifica nella funzione checkForMatch
function disableCards() {
    matches++;
    document.getElementById("matches").textContent = matches;
    const name = firstCard.dataset.name;
    
    // Aggiorna entrambi i box contemporaneamente
    updateNarrator(name, manzonianQuotes[name]);

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    resetTurn();
    if (matches === totalPairs) handleVictory();
}
