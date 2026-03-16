// CONFIGURAZIONE CARTE E CITAZIONI (Codice Originale)
const originalCards = [
    { name: "Renzo", img: "renzo.png" },
    { name: "Lucia", img: "lucia.png" },
    { name: "Don Rodrigo", img: "don-rodrigo.png" },
    { name: "Fra Cristoforo", img: "fra-cristoforo.png" },
    { name: "Agnese", img: "agnese.png" },
    { name: "Azzeccagarbugli", img: "azzeccagarbugli.png" },
    { name: "I Bravi", img: "bravi.png" },
    { name: "Don Abbondio", img: "don-abbondio.png" },
    { name: "Gertrude", img: "gertrude.png" },
    { name: "L'Innominato", img: "innominato.png" },
    { name: "Madre Cecilia", img: "madre-cecilia.png" },
    { name: "Perpetua", img: "perpetua.png" }
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

// VARIABILI DI STATO (Codice Originale)
let hasFlipped = false;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let tries = 0;
let matches = 0;
let currentLevel = "medium";
let totalPairs = 0;
let timerInterval = null;
let currentTime = 180;

// --- LOGICA DI APERTURA MANOSCRITTO ---
window.onload = () => {
    // Il libro si apre dopo 1 secondo dall'avvio
    setTimeout(() => {
        const book = document.getElementById("bookContainer");
        if (book) book.classList.add("open");
    }, 1000);
};

// Avvio del gioco dal bottone nella copertina
document.getElementById("startGameBtn").addEventListener("click", () => {
    const selectedLevel = document.getElementById("levelSelectIntro").value;
    // Sincronizza il selettore interno al gioco
    document.getElementById("levelSelectGame").value = selectedLevel;
    
    // Scomparsa intro e apparizione gioco
    document.getElementById("intro-screen").classList.add("fade-out");
    document.getElementById("main-game").classList.remove("hidden");
    
    initGame(selectedLevel);
});

// --- LOGICA DI GIOCO ORIGINALE (RIPRISTINATA) ---

function initGame(levelKey) {
    currentLevel = levelKey;
    const selectedNames = LEVEL_SETS[levelKey];
    const selectedCards = selectedNames.map(name => originalCards.find(c => c.name === name));
    totalPairs = selectedCards.length;
    document.getElementById("totalPairs").textContent = totalPairs;

    const deck = [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);

    const board = document.getElementById("board");
    board.innerHTML = "";
    board.style.setProperty("--cols", totalPairs <= 6 ? 4 : (totalPairs <= 10 ? 5 : 6));

    deck.forEach(data => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.name = data.name;
        // Struttura HTML delle carte originale per il flip CSS
        card.innerHTML = `
            <div class="inner">
                <div class="back"></div>
                <div class="front">
                    <img src="img/${data.img}" alt="${data.name}">
                </div>
            </div>
        `;
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    resetState();
    startTimer();
    updateNarrator("Il Narratore", "« Si riapre il capitolo... Trova le coppie per proseguire. »");
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains("matched")) return;

    this.classList.add("flipped");

    if (!hasFlipped) {
        hasFlipped = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    tries++;
    document.getElementById("tries").textContent = tries;

    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        matches++;
        document.getElementById("matches").textContent = matches;
        
        // Mostra la citazione del personaggio trovato
        const name = firstCard.dataset.name;
        updateNarrator(name, manzonianQuotes[name]);

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resetTurn();

        if (matches === totalPairs) {
            handleVictory();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    [hasFlipped, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetState() {
    matches = 0;
    tries = 0;
    document.getElementById("matches").textContent = "0";
    document.getElementById("tries").textContent = "0";
    clearInterval(timerInterval);
    
    // Imposta tempo in base al livello
    if (currentLevel === "easy") currentTime = 120;
    else if (currentLevel === "medium") currentTime = 180;
    else currentTime = 240;

    updateTimerDisplay();
    
    document.getElementById("victoryOverlay").classList.add("hidden");
    document.getElementById("defeatOverlay").classList.add("hidden");
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) {
            clearInterval(timerInterval);
            document.getElementById("defeatOverlay").classList.remove("hidden");
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.getElementById("timer").textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateNarrator(title, quote) {
    const message = `<span class="char-title">${title}:</span> ${quote}`;
    document.getElementById("message-top").innerHTML = message;
    document.getElementById("message-bottom").innerHTML = message;
}

function handleVictory() {
    clearInterval(timerInterval);
    setTimeout(() => {
        document.getElementById("victoryOverlay").classList.remove("hidden");
    }, 500);
}

// EVENT LISTENER CONTROLLI (Codice Originale)
document.getElementById("resetBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("playAgainBtn").addEventListener("click", () => location.reload());
document.getElementById("tryAgainBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("levelSelectGame").addEventListener("change", (e) => initGame(e.target.value));
