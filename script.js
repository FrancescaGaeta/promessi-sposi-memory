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
    document.getElementById("main-game").classList.add("hidden");
    setTimeout(() => { document.getElementById("bookContainer").classList.add("open"); }, 500);
};

document.getElementById("startGameBtn").addEventListener("click", () => {
    const lvl = document.getElementById("levelSelectIntro").value;
    document.getElementById("levelSelectGame").value = lvl;
    document.getElementById("intro-screen").classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("intro-screen").classList.add("hidden");
        document.getElementById("main-game").classList.remove("hidden");
        initGame(lvl);
    }, 1500);
});

function initGame(levelKey) {
    currentLevel = levelKey;
    document.getElementById("finalOverlay").classList.add("hidden");
    document.getElementById("finalBookContainer").classList.remove("open");
    
    const selected = LEVEL_SETS[levelKey].map(name => originalCards.find(c => c.name === name));
    totalPairs = selected.length;
    document.getElementById("totalPairs").textContent = totalPairs;
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);
    const board = document.getElementById("board");
    board.innerHTML = "";
    
    // MODIFICA: Sempre 6 colonne, esattamente come nel livello difficile
    board.style.setProperty("--cols", 6);

    deck.forEach(data => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.name = data.name;
        card.innerHTML = `<div class="inner"><div class="back"></div><div class="front"><img src="img/${data.img}"></div></div>`;
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    resetState();
    startTimer();
    updateNarrator(null, "« Tutte quelle immagini gli si affollavano alla mente, s’urtavano, si confondevano »");
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
    currentTime = currentLevel === "easy" ? 120 : (currentLevel === "medium" ? 180 : 240);
    updateTimerDisplay();
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) { 
            clearInterval(timerInterval); 
            handleEndGame(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(currentTime / 60);
    const sec = currentTime % 60;
    document.getElementById("timer").textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function updateNarrator(title, quote) {
    let content;
    if (title) {
        content = `<span class="char-title"><b>${title}:</b></span> ${quote}`;
    } else {
        content = quote;
    }
    document.getElementById("message-top").innerHTML = content;
    document.getElementById("message-bottom").innerHTML = content;
}

function handleEndGame(isVictory) {
    clearInterval(timerInterval);
    const overlay = document.getElementById("finalOverlay");
    const container = document.getElementById("finalBookContainer");
    const img = document.getElementById("finalStatusImg");
    const title = document.getElementById("finalTitle");
    const text = document.getElementById("finalText");
    const btn = document.getElementById("finalActionBtn");

    if (isVictory) {
        img.src = "vittoria.png";
        title.textContent = "La Provvidenza vi ha guidato!";
        text.innerHTML = "L’intreccio è sciolto! Avete rintracciato ogni sembiante e dato ordine al guazzabuglio.<br> La vostra memoria sia lodata.";
        btn.textContent = "Rimescolar le carte";
    } else {
        img.src = "sconfitta.png";
        title.textContent = "Il tempo è trascorso invano...";
        text.innerHTML = "Le carte si sono rimescolate e il tempo è fuggito come un testimone reticente!<br> All'opera, messere: riprovate.";
        btn.textContent = "Riprova la sorte";
    }

    overlay.classList.remove("hidden");
    setTimeout(() => container.classList.add("open"), 100);
}

document.getElementById("finalActionBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("resetBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("levelSelectGame").addEventListener("change", (e) => initGame(e.target.value));
