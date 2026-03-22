const translations = {
    it: {
        introTitle: "Memory Game",
        introQuote: "\"L'imprese illustri e i casi memorabili si debbono trarre dall'oscurità dell'oblio. <br>Aguzzate dunque l'ingegno, o Lettore: accoppiate i volti e le sventure, affinché la memoria non perda ciò che la Provvidenza ha scritto.\"",
        labelDiff: "Difficoltà:",
        optEasy: "Facile (6 coppie)",
        optMedium: "Medio (9 coppie)",
        optHard: "Difficile (12 coppie)",
        btnStart: "Inizia",
        gameTitle: "Memory – I promessi sposi",
        labelLvl: "Livello:",
        labelTime: "Tempo:",
        labelMoves: "Mosse:",
        labelPairs: "Coppie:",
        btnReset: "Ricomincia la partita",
        lvlEasy: "Facile",
        lvlMedium: "Medio",
        lvlHard: "Difficile",
        initQuote: "« Tutte quelle immagini gli si affollavano alla mente, s’urtavano, si confondevano »",
        winTitle: "La Provvidenza vi ha guidato!",
        winText: "L’intreccio è sciolto! Avete rintracciato ogni sembiante e dato ordine al guazzabuglio.<br> La vostra memoria sia lodata.",
        winBtn: "Rimescolar le carte",
        loseTitle: "Il tempo è trascorso invano...",
        loseText: "Le carte si sono rimescolate e il tempo è fuggito come un testimone reticente!<br> All'opera, messere: riprovate.",
        loseBtn: "Riprova la sorte",
        characters: {
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
        }
    },
    en: {
        introTitle: "Memory Game",
        introQuote: "\"Famous deeds and memorable cases must be rescued from the darkness of oblivion. <br>Sharpen your wit, O Reader: match the faces and the misfortunes, so that memory does not lose what Providence has written.\"",
        labelDiff: "Difficulty:",
        optEasy: "Easy (6 pairs)",
        optMedium: "Medium (9 pairs)",
        optHard: "Hard (12 pairs)",
        btnStart: "Start",
        gameTitle: "Memory – The Betrothed",
        labelLvl: "Level:",
        labelTime: "Time:",
        labelMoves: "Moves:",
        labelPairs: "Pairs:",
        btnReset: "Restart Match",
        lvlEasy: "Easy",
        lvlMedium: "Medium",
        lvlHard: "Hard",
        initQuote: "« All those images crowded into his mind, they collided, they confused each other »",
        winTitle: "Providence has guided you!",
        winText: "The plot is untangled! You have traced every semblance and given order to the muddle.<br> Blessed be your memory.",
        winBtn: "Shuffle the cards",
        loseTitle: "Time has passed in vain...",
        loseText: "The cards have been reshuffled and time has fled like a reluctant witness!<br> To work, sir: try again.",
        loseBtn: "Try your luck again",
        characters: {
            "Renzo": "«Renzo, a silk weaver by trade…»",
            "Lucia": "«Lucia, shy and resolute, the betrothed.»",
            "Don Rodrigo": "«This marriage is not to be done.»",
            "Fra Cristoforo": "«A friar who laid down his sword, not his courage.»",
            "Agnese": "«Agnese, a practical and sensible mother.»",
            "Azzeccagarbugli": "«The lawyer who confuses rather than clarifies.»",
            "I Bravi": "«Dark figures, arms in the pay of the powerful.»",
            "Don Abbondio": "«Courage, if one doesn't have it, one can't just give it to oneself.»",
            "Gertrude": "«The 'unfortunate one replied'.»",
            "L'Innominato": "«A great soul gone astray, in search of redemption.»",
            "Madre Cecilia": "«The plague reaps, but charity consoles.»",
            "Perpetua": "«Perpetua, a frank and quick-tongued servant.»"
        }
    }
};

const originalCards = [
    { name: "Renzo", img: "renzo.png" }, { name: "Lucia", img: "lucia.png" },
    { name: "Don Rodrigo", img: "don-rodrigo.png" }, { name: "Fra Cristoforo", img: "fra-cristoforo.png" },
    { name: "Agnese", img: "agnese.png" }, { name: "Azzeccagarbugli", img: "azzeccagarbugli.png" },
    { name: "I Bravi", img: "bravi.png" }, { name: "Don Abbondio", img: "don-abbondio.png" },
    { name: "Gertrude", img: "gertrude.png" }, { name: "L'Innominato", img: "innominato.png" },
    { name: "Madre Cecilia", img: "madre-cecilia.png" }, { name: "Perpetua", img: "perpetua.png" }
];

const LEVEL_SETS = {
    easy: ["Renzo", "Lucia", "Agnese", "Fra Cristoforo", "Don Abbondio", "Perpetua"],
    medium: ["Renzo", "Lucia", "Fra Cristoforo", "Don Abbondio", "Perpetua", "Don Rodrigo", "I Bravi", "Azzeccagarbugli", "Gertrude"],
    hard: ["Renzo", "Lucia", "Agnese", "Fra Cristoforo", "Don Abbondio", "Perpetua", "Don Rodrigo", "I Bravi", "Azzeccagarbugli", "Gertrude", "L'Innominato", "Madre Cecilia"]
};

let currentLang = 'it';
let hasFlipped = false, firstCard = null, secondCard = null, lockBoard = false;
let tries = 0, matches = 0, currentLevel = "medium", totalPairs = 0, timerInterval = null, currentTime = 180;

window.onload = () => {
    document.getElementById("main-game").classList.add("hidden");
    setTimeout(() => { document.getElementById("bookContainer").classList.add("open"); }, 500);
    updateUILanguage();
};

// Cambio Lingua
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentLang = this.dataset.lang;
        updateUILanguage();
    });
});

function updateUILanguage() {
    const t = translations[currentLang];
    document.getElementById("ui-intro-title").textContent = t.introTitle;
    document.getElementById("ui-intro-quote").innerHTML = t.introQuote;
    document.getElementById("ui-label-diff").textContent = t.labelDiff;
    document.getElementById("opt-easy").textContent = t.optEasy;
    document.getElementById("opt-medium").textContent = t.optMedium;
    document.getElementById("opt-hard").textContent = t.optHard;
    document.getElementById("startGameBtn").textContent = t.btnStart;
    
    document.getElementById("ui-game-title").textContent = t.gameTitle;
    document.getElementById("ui-label-lvl").textContent = t.labelLvl;
    document.getElementById("ui-label-time").textContent = t.labelTime;
    document.getElementById("ui-label-moves").textContent = t.labelMoves;
    document.getElementById("ui-label-pairs").textContent = t.labelPairs;
    document.getElementById("resetBtn").textContent = t.btnReset;

    // Traduzione selettore livello nel gioco
    const gameLvlSelect = document.getElementById("levelSelectGame");
    gameLvlSelect.options[0].text = t.lvlEasy;
    gameLvlSelect.options[1].text = t.lvlMedium;
    gameLvlSelect.options[2].text = t.lvlHard;
}

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
    
    if (window.innerWidth <= 768) {
        board.style.setProperty("--cols", (levelKey === "medium" || levelKey === "hard") ? 4 : 3);
    } else {
        board.style.setProperty("--cols", 6);
    }

    const bottomQuote = document.getElementById("message-bottom").parentElement;
    if (levelKey === "easy" || levelKey === "medium") {
        bottomQuote.classList.add("hidden");
    } else {
        bottomQuote.classList.remove("hidden");
    }

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
    updateNarrator(null, translations[currentLang].initQuote);
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
        const charQuote = translations[currentLang].characters[firstCard.dataset.name];
        updateNarrator(firstCard.dataset.name, charQuote);
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
        if (currentTime <= 0) { clearInterval(timerInterval); handleEndGame(false); }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(currentTime / 60);
    const sec = currentTime % 60;
    document.getElementById("timer").textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function updateNarrator(title, quote) {
    let content = title ? `<span class="char-title"><b>${title}:</b></span> ${quote}` : quote;
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
    const t = translations[currentLang];

    if (isVictory) {
        img.src = "vittoria.png";
        title.textContent = t.winTitle;
        text.innerHTML = t.winText;
        btn.textContent = t.winBtn;
    } else {
        img.src = "sconfitta.png";
        title.textContent = t.loseTitle;
        text.innerHTML = t.loseText;
        btn.textContent = t.loseBtn;
    }

    overlay.classList.remove("hidden");
    setTimeout(() => container.classList.add("open"), 100);
}

document.getElementById("finalActionBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("resetBtn").addEventListener("click", () => initGame(currentLevel));
document.getElementById("levelSelectGame").addEventListener("change", (e) => initGame(e.target.value));
