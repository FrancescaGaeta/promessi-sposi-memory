// Dati e logica originale (Renzo, Lucia, ecc.) - Invariati
const originalCards = [
    { name: "Renzo", img: "renzo.png" }, { name: "Lucia", img: "lucia.png" },
    { name: "Don Rodrigo", img: "don-rodrigo.png" }, { name: "Fra Cristoforo", img: "fra-cristoforo.png" },
    { name: "Agnese", img: "agnese.png" }, { name: "Azzeccagarbugli", img: "azzeccagarbugli.png" },
    { name: "I Bravi", img: "bravi.png" }, { name: "Don Abbondio", img: "don-abbondio.png" },
    { name: "Gertrude", img: "gertrude.png" }, { name: "L'Innominato", img: "innominato.png" },
    { name: "Madre Cecilia", img: "madre-cecilia.png" }, { name: "Perpetua", img: "perpetua.png" }
];

// ... (manzonianQuotes e LEVEL_SETS rimangono i tuoi originali)

let hasFlipped = false, firstCard = null, secondCard = null, lockBoard = false;
let tries = 0, matches = 0, currentLevel = "medium", totalPairs = 0;

// Trigger Apertura
window.onload = () => {
    setTimeout(() => {
        document.getElementById("bookContainer").classList.add("open");
    }, 800);
};

// Start Game
document.getElementById("startGameBtn").addEventListener("click", () => {
    const lvl = document.getElementById("levelSelectIntro").value;
    document.getElementById("intro-screen").classList.add("fade-out");
    document.getElementById("main-game").classList.remove("hidden");
    initGame(lvl);
});

// Funzione initGame originale
function initGame(levelKey) {
    const selected = LEVEL_SETS[levelKey].map(name => originalCards.find(c => c.name === name));
    totalPairs = selected.length;
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
    // ... reset timer e variabili
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains("matched")) return;
    this.classList.add("flipped");
    if (!hasFlipped) { hasFlipped = true; firstCard = this; return; }
    secondCard = this;
    if (firstCard.dataset.name === secondCard.dataset.name) {
        // match...
        firstCard.classList.add("matched"); secondCard.classList.add("matched");
        [hasFlipped, firstCard] = [false, null];
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            [hasFlipped, lockBoard, firstCard, secondCard] = [false, false, null, null];
        }, 1000);
    }
}
