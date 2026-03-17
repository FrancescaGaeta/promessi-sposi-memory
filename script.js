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
let tries = 0, matches = 0, currentLevel = "medium", totalPairs = 0, timerInterval = null, currentTime = 180;

window.onload = () => {
    setTimeout(() => { document.getElementById("bookContainer").classList.add("open"); }, 1000);
};

document.getElementById("startGameBtn").addEventListener("click", () => {
    const lvl = document.getElementById("levelSelectIntro").value;
    document.getElementById("intro-screen").classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("intro-screen").classList.add("hidden");
        document.getElementById("main-game").classList.remove("hidden");
        initGame(lvl);
    }, 1000);
});

function initGame(levelKey) {
    currentLevel = levelKey;
    document.getElementById("finalOverlay").classList.add("hidden");
    document.getElementById("finalBookContent").classList.remove("open");
    
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
        // Percorso img/ per i personaggi
        card.innerHTML = `<div class="inner"><div class="back"></div><div class="front"><img src="img/${data.img}"></div></div>`;
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    resetState();
    startTimer();
    updateNarrator("Il Narratore", "« Tutte quelle immagini gli si affollavano alla mente, »");
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
        if (matches === totalPairs) handleEndGame(true);
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
    currentTime = 180;
    updateTimerDisplay();
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) { clearInterval(timerInterval); handleEndGame(false); }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(currentTime / 60);
    const sec = currentTime % 60;
    document.getElementById("timer").textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function updateNarrator(title, quote) {
    const content = `<b>${title}:</b> ${quote}`;
    document.getElementById("message-top").innerHTML = content;
    document.getElementById("message-bottom").innerHTML = content;
}

function handleEndGame(isVictory) {
    clearInterval(timerInterval);
    const img = document.getElementById("finalStatusImg");
    const title = document.getElementById("finalTitle");
    const text = document.getElementById("finalText");
    const btn = document.getElementById("finalActionBtn");

    // Percorso root per vittoria/sconfitta
    if (isVictory) {
        img.src = "vittoria.png";
        title.textContent = "Vittoria!";
        text.innerHTML = "La Provvidenza vi ha guidato a sciogliere l'intreccio.";
        btn.textContent = "Gioca Ancora";
    } else {
        img.src = "sconfitta.png";
        title.textContent = "Sconfitta";
        text.innerHTML = "Il tempo è fuggito, lasciando le memorie confuse.";
        btn.textContent = "Riprova";
    }

    document.getElementById("finalOverlay").classList.remove("hidden");
    setTimeout(() => document.getElementById("finalBookContent").classList.add("open"), 100);
}

document.getElementById("resetBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("finalActionBtn").addEventListener("click", () => initGame(currentLevel));
