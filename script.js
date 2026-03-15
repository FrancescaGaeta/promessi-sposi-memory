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

let hasFlipped = false, firstCard = null, secondCard = null, lockBoard = false;
let tries = 0, matches = 0, currentTime = 180, timerInterval = null;

const board = document.querySelector(".game-board");
const messageEl = document.getElementById("message");

function updateNarrator(title, quote) {
    messageEl.classList.remove("fade-in");
    void messageEl.offsetWidth;
    messageEl.innerHTML = `<div class="char-name">${title}</div>${quote}`;
    messageEl.classList.add("fade-in");
}

function initGame() {
    const levelKey = document.getElementById("levelSelect").value;
    const selected = LEVEL_SETS[levelKey].map(name => originalCards.find(c => c.name === name));
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);
    
    board.style.setProperty("--cols", selected.length <= 6 ? 4 : (selected.length <= 10 ? 5 : 6));
    board.innerHTML = "";
    
    deck.forEach(data => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.name = data.name;
        card.innerHTML = `
            <div class="inner">
                <div class="back"></div>
                <div class="front"><img src="img/${data.img}"></div>
            </div>`;
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    resetStats(levelKey);
    updateNarrator("Il Narratore", "«Quel ramo del lago di Como...»");
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains("matched")) return;
    this.classList.add("flipped");
    if (!hasFlipped) { hasFlipped = true; firstCard = this; return; }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        matches++;
        document.getElementById("matches").textContent = matches;
        const name = firstCard.dataset.name;
        updateNarrator(name, manzonianQuotes[name]);
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resetTurn();
        if (matches === parseInt(document.getElementById("totalPairs").textContent)) handleVictory();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }, 1000);
    }
    tries++;
    document.getElementById("tries").textContent = tries;
}

function resetTurn() { [hasFlipped, lockBoard] = [false, false]; [firstCard, secondCard] = [null, null]; }

function resetStats(level) {
    matches = 0; tries = 0;
    document.getElementById("matches").textContent = "0";
    document.getElementById("tries").textContent = "0";
    document.getElementById("totalPairs").textContent = LEVEL_SETS[level].length;
    clearInterval(timerInterval);
    currentTime = 180;
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTime--;
        const min = Math.floor(currentTime / 60);
        const sec = currentTime % 60;
        document.getElementById("timer").textContent = `${min}:${sec.toString().padStart(2, '0')}`;
        if (currentTime <= 0) { clearInterval(timerInterval); document.getElementById("defeatOverlay").classList.remove("hidden"); }
    }, 1000);
}

function handleVictory() { clearInterval(timerInterval); document.getElementById("victoryOverlay").classList.remove("hidden"); }

document.getElementById("levelSelect").addEventListener("change", initGame);
document.getElementById("resetBtn").addEventListener("click", initGame);
document.getElementById("playAgainBtn").addEventListener("click", () => { document.getElementById("victoryOverlay").classList.add("hidden"); initGame(); });
document.getElementById("tryAgainBtn").addEventListener("click", () => { document.getElementById("defeatOverlay").classList.add("hidden"); initGame(); });

initGame();


