const originalCards = [
    { name: "Renzo", img: "renzo.png" }, { name: "Lucia", img: "lucia.png" },
    { name: "Don Rodrigo", img: "don-rodrigo.png" }, { name: "Fra Cristoforo", img: "fra-cristoforo.png" },
    { name: "Agnese", img: "agnese.png" }, { name: "Azzeccagarbugli", img: "azzeccagarbugli.png" },
    { name: "I Bravi", img: "bravi.png" }, { name: "Don Abbondio", img: "don-abbondio.png" },
    { name: "Gertrude", img: "gertrude.png" }, { name: "L'Innominato", img: "innominato.png" },
    { name: "Madre Cecilia", img: "madre-cecilia.png" }, { name: "Perpetua", img: "perpetua.png" }
];

const manzonianQuotes = {
    "Renzo": "«Renzo, di professione filatore di seta…»",
    "Lucia": "«Lucia, timida e risoluta, promessa sposa.»",
    "Don Rodrigo": "«Questo matrimonio non s'ha da fare.»",
    "Fra Cristoforo": "«Un frate che ha deposto la spada, non il coraggio.»",
    "Agnese": "«Agnese, madre pratica e di buon senso.»",
    "Azzeccagarbugli": "«L'avvocato che confonde più che chiarire.»",
    "I Bravi": "«Oscure figure, braccia al soldo del potente.»",
    "Don Abbondio": "«Il coraggio, uno, se non ce l'ha, mica se lo può dare.»",
    "Gertrude": "«La 'sventurata rispose'.»",
    "L'Innominato": "«Un animo grande traviato, in cerca di redenzione.»",
    "Madre Cecilia": "«La peste miete, ma la carità consola.»",
    "Perpetua": "«Perpetua, serva franca e di lingua sciolta.»"
};

const LEVEL_SETS = {
    easy: ["Renzo", "Lucia", "Agnese", "Fra Cristoforo", "Don Abbondio", "Perpetua"],
    medium: ["Renzo", "Lucia", "Agnese", "Fra Cristoforo", "Don Abbondio", "Perpetua", "Don Rodrigo", "I Bravi", "Azzeccagarbugli", "Gertrude"],
    hard: ["Renzo", "Lucia", "Agnese", "Fra Cristoforo", "Don Abbondio", "Perpetua", "Don Rodrigo", "I Bravi", "Azzeccagarbugli", "Gertrude", "L'Innominato", "Madre Cecilia"]
};

let hasFlipped = false, firstCard = null, secondCard = null, lockBoard = false;
let tries = 0, matches = 0, currentLevel = "medium", totalPairs = 0;
let timerInterval = null, currentTime = 180;

const board = document.getElementById("board");
const msgTop = document.getElementById("message-top");
const msgBottom = document.getElementById("message-bottom");
const introOverlay = document.getElementById("intro-screen");
const bookContainer = document.getElementById("bookContainer");

// 1. GESTIONE ANIMAZIONE LIBRO
document.getElementById("bookCover").addEventListener("click", () => {
    bookContainer.classList.add("open");
});

document.getElementById("startGameBtn").addEventListener("click", () => {
    const level = document.getElementById("levelSelectIntro").value;
    document.getElementById("levelSelectBar").value = level; // Sincronizza la barra
    introOverlay.classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("main-game").classList.remove("hidden");
        initGame(level);
    }, 800);
});

// 2. LOGICA NARRATORE
function updateNarrator(title, quote) {
    const content = quote ? `<span class="char-title">${title}</span> ${quote}` : title;
    [msgTop, msgBottom].forEach(el => {
        el.innerHTML = content;
        el.classList.remove("fade-in");
        void el.offsetWidth;
        el.classList.add("fade-in");
    });
}

// 3. LOGICA GIOCO
function initGame(levelKey) {
    currentLevel = levelKey;
    const selected = LEVEL_SETS[levelKey].map(name => originalCards.find(c => c.name === name));
    totalPairs = selected.length;
    document.getElementById("totalPairs").textContent = totalPairs;
    
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);
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
    updateNarrator("«Si riapre il capitolo... Trova le coppie.»", "");
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

function resetTurn() { [hasFlipped, lockBoard] = [false, false]; [firstCard, secondCard] = [null, null]; }

function resetState() {
    matches = 0; tries = 0;
    document.getElementById("matches").textContent = "0";
    document.getElementById("tries").textContent = "0";
    clearInterval(timerInterval);
    currentTime = currentLevel === "easy" ? 120 : 180;
    updateTimerDisplay();
    document.getElementById("victoryOverlay").classList.add("hidden");
    document.getElementById("defeatOverlay").classList.add("hidden");
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) { clearInterval(timerInterval); document.getElementById("defeatOverlay").classList.remove("hidden"); }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(currentTime / 60);
    const sec = currentTime % 60;
    document.getElementById("timer").textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function handleVictory() { 
    clearInterval(timerInterval); 
    setTimeout(() => document.getElementById("victoryOverlay").classList.remove("hidden"), 500); 
}

// LISTENERS
document.getElementById("resetBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("levelSelectBar").addEventListener("change", (e) => initGame(e.target.value));
document.getElementById("playAgainBtn").addEventListener("click", () => location.reload());
document.getElementById("tryAgainBtn").addEventListener("click", () => initGame(currentLevel));

// LISTENERS RESET
document.getElementById("resetBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("playAgainBtn").addEventListener("click", () => location.reload());
document.getElementById("tryAgainBtn").addEventListener("click", () => initGame(currentLevel));

