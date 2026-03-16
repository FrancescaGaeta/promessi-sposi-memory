// ... (tue costanti originalCards, manzonianQuotes, LEVEL_SETS identiche a prima)

let hasFlipped = false, firstCard = null, secondCard = null, lockBoard = false;
let tries = 0, matches = 0, currentLevel = "medium", totalPairs = 0;
let timerInterval = null, currentTime = 180;

// ANIMAZIONE APERTURA
window.onload = () => {
    setTimeout(() => {
        document.getElementById("bookContainer").classList.add("open");
    }, 1000);
};

// Funzione Start Game
document.getElementById("startGameBtn").addEventListener("click", () => {
    const level = document.getElementById("levelSelectIntro").value;
    document.getElementById("levelSelectGame").value = level;
    document.getElementById("intro-screen").classList.add("fade-out");
    document.getElementById("main-game").classList.remove("hidden");
    initGame(level);
});

// LOGICA GIOCO ORIGINALE RIPRISTINATA
function initGame(levelKey) {
    currentLevel = levelKey;
    const selected = LEVEL_SETS[levelKey].map(name => originalCards.find(c => c.name === name));
    totalPairs = selected.length;
    document.getElementById("totalPairs").textContent = totalPairs;
    
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);
    const board = document.getElementById("board");
    board.innerHTML = "";
    board.style.setProperty("--cols", totalPairs <= 6 ? 4 : (totalPairs <= 10 ? 5 : 6));

    deck.forEach(data => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.name = data.name;
        card.innerHTML = `
            <div class="inner">
                <div class="back"></div>
                <div class="front"><img src="img/${data.img}"></div>
            </div>`;
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    resetState();
    startTimer();
    updateNarrator("Il Narratore", "«Si riapre il capitolo... Trova le coppie.»");
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains("matched")) return;
    this.classList.add("flipped");
    if (!hasFlipped) { hasFlipped = true; firstCard = this; return; }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    tries++;
    document.getElementById("tries").textContent = tries;
    if (firstCard.dataset.name === secondCard.dataset.name) {
        matches++;
        document.getElementById("matches").textContent = matches;
        updateNarrator(firstCard.dataset.name, manzonianQuotes[firstCard.dataset.name]);
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resetTurn();
        if (matches === totalPairs) handleVictory();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }, 1000);
    }
}

// ... restanti funzioni resetTurn, resetState, startTimer, updateTimerDisplay, updateNarrator, handleVictory uguali all'originale
