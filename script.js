// =======================
// CONTENUTI (PERSONAGGI)
// =======================
const originalCards = [
  { name: "Renzo", img: "renzo.png" },
  { name: "Lucia", img: "lucia.png" },
  { name: "DonRodrigo", img: "don-rodrigo.png" },
  { name: "FraCristoforo", img: "fra-cristoforo.png" },
  { name: "Agnese", img: "agnese.png" },
  { name: "Azzeccagarbugli", img: "azzeccagarbugli.png" },
  { name: "Bravi", img: "bravi.png" },
  { name: "DonAbbondio", img: "don-abbondio.png" },
  { name: "Gertrude", img: "gertrude.png" },
  { name: "Innominato", img: "innominato.png" },
  { name: "MadreCecilia", img: "madre-cecilia.png" },
  { name: "Perpetua", img: "perpetua.png" }
];

// =======================
// FRASI "MANZONIANE"
// =======================
const manzonianQuotes = {
  Renzo: "«Renzo, di professione filatore di seta…»",
  Lucia: "«Lucia, timida e risoluta, promessa sposa.»",
  DonRodrigo: "«Questo matrimonio non s'ha da fare.»",
  FraCristoforo: "«Un frate che ha deposto la spada, non il coraggio.»",
  Agnese: "«Agnese, madre pratica e di buon senso.»",
  Azzeccagarbugli: "«L'avvocato che confonde più che chiarire.»",
  Bravi: "«Oscure figure, braccia al soldo del potente.»",
  DonAbbondio: "«Il coraggio, uno, se non ce l'ha, mica se lo può dare.»",
  Gertrude: "«La 'sventurata rispose'.»",
  Innominato: "«Un animo grande traviato, in cerca di redenzione.»",
  MadreCecilia: "«La peste miete, ma la carità consola.»",
  Perpetua: "«Perpetua, serva franca e di lingua sciolta.»"
};

// =======================
// CAMPAGNA: ordine + set personaggi per livello
// (più didattico, non casuale)
// =======================
const LEVEL_ORDER = ["easy", "medium", "hard"];

// Scegli qui i personaggi per ogni livello (puoi cambiarli come vuoi)
const LEVEL_SETS = {
  easy:   ["Renzo", "Lucia", "Agnese", "FraCristoforo", "DonAbbondio", "Perpetua"], // 6 coppie
  medium: ["Renzo", "Lucia", "Agnese", "FraCristoforo", "DonAbbondio", "Perpetua", "DonRodrigo", "Bravi", "Azzeccagarbugli", "Gertrude"], // 10 coppie
  hard:   ["Renzo", "Lucia", "Agnese", "FraCristoforo", "DonAbbondio", "Perpetua", "DonRodrigo", "Bravi", "Azzeccagarbugli", "Gertrude", "Innominato", "MadreCecilia"] // 12 coppie
};

const LEVELS = {
  easy:   { time: 120 }, // 2:00
  medium: { time: 180 }, // 3:00
  hard:   { time: 180 }  // 3:00 (o 150 per renderlo più tosto)
};

// =======================
// RIFERIMENTI DOM
// =======================
let cardsData = [];
const board = document.querySelector(".game-board");
const triesSpan = document.getElementById("tries");
const matchesSpan = document.getElementById("matches");
const totalPairsSpan = document.getElementById("totalPairs");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const timerSpan = document.getElementById("timer");
const victoryOverlay = document.getElementById("victoryOverlay");
const defeatOverlay = document.getElementById("defeatOverlay");
const playAgainBtn = document.getElementById("playAgainBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const levelSelect = document.getElementById("levelSelect");

// =======================
// STATO GIOCO
// =======================
let hasFlipped = false;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let tries = 0;
let matches = 0;

let currentLevel = "medium";
let totalPairs = 0;

let gameOver = false;

// =======================
// TIMER (dinamico)
// =======================
let countdownSeconds = 180;
let currentTime = countdownSeconds;
let timerInterval = null;

function updateTimerDisplay() {
  const minutes = String(Math.floor(currentTime / 60)).padStart(2, "0");
  const seconds = String(currentTime % 60).padStart(2, "0");
  timerSpan.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    currentTime--;
    if (currentTime <= 0) {
      currentTime = 0;
      updateTimerDisplay();
      clearInterval(timerInterval);
      handleTimeOver();
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function handleTimeOver() {
  gameOver = true;
  lockBoard = true;
  messageEl.textContent = "«Il tempo è trascorso: come molte storie, anche questa resta incompiuta.»";
  defeatOverlay.classList.remove("hidden");
}

// =======================
// UTILITY
// =======================
function getCardByName(name) {
  return originalCards.find(c => c.name === name) || null;
}

function shuffle(arr) {
  // Fisher-Yates
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function computeCols(pairCount) {
  if (pairCount <= 6) return 4;
  if (pairCount <= 10) return 5;
  return 6;
}

function applyBoardCols(cols) {
  board.style.setProperty("--cols", String(cols));
}

function nextLevelKey() {
  const i = LEVEL_ORDER.indexOf(currentLevel);
  if (i === -1) return LEVEL_ORDER[0];
  return LEVEL_ORDER[Math.min(i + 1, LEVEL_ORDER.length - 1)];
}

function isLastLevel() {
  return currentLevel === LEVEL_ORDER[LEVEL_ORDER.length - 1];
}

function narrateLevelStart(levelKey) {
  const titles = { easy: "Facile", medium: "Medio", hard: "Difficile" };
  const t = titles[levelKey] || levelKey;
  messageEl.innerHTML = `«Si riapre il capitolo…»<br>Livello <strong>${t}</strong>: trova tutte le coppie.`;
}

// =======================
// INIZIALIZZAZIONE PARTITA
// =======================
function initGame(levelKey = currentLevel) {
  currentLevel = levelKey;

  // sincronizza select
  if (levelSelect.value !== currentLevel) levelSelect.value = currentLevel;

  const cfg = LEVELS[currentLevel] || LEVELS.medium;

  // set personaggi per livello
  const setNames = LEVEL_SETS[currentLevel] || LEVEL_SETS.medium;
  const selected = setNames.map(getCardByName).filter(Boolean);

  totalPairs = selected.length;
  countdownSeconds = cfg.time;

  // UI
  totalPairsSpan.textContent = totalPairs;

  // pulizia board
  board.innerHTML = "";

  // crea mazzo (2 copie) e mescola
  cardsData = shuffle([...selected, ...selected]);

  // griglia
  applyBoardCols(computeCols(totalPairs));

  // crea carte nel DOM
  cardsData.forEach(cardInfo => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = cardInfo.name;

    card.innerHTML = `
      <div class="inner">
        <div class="back"></div>
        <img class="front" src="img/${cardInfo.img}" alt="${cardInfo.name}">
      </div>
    `;
    board.appendChild(card);
  });

  // reset stato gioco
  hasFlipped = false;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameOver = false;

  // reset contatori
  tries = 0;
  matches = 0;
  triesSpan.textContent = tries;
  matchesSpan.textContent = matches;

  // reset overlay
  victoryOverlay.classList.add("hidden");
  defeatOverlay.classList.add("hidden");

  // testo narratore
  narrateLevelStart(currentLevel);

  // reset timer
  if (timerInterval) clearInterval(timerInterval);
  currentTime = countdownSeconds;
  updateTimerDisplay();
  startTimer();

  // bottone overlay: in campagna è "Prosegui" finché non sei all'ultimo
  playAgainBtn.textContent = isLastLevel() ? "Gioca ancora" : "Prosegui";
}

// =======================
// EVENTI: click board
// =======================
board.addEventListener("click", e => {
  if (gameOver) return;

  const clicked = e.target.closest(".card");
  if (!clicked) return;
  if (clicked.classList.contains("flipped")) return;
  if (lockBoard) return;

  clicked.classList.add("flipped");

  if (!hasFlipped) {
    hasFlipped = true;
    firstCard = clicked;
  } else {
    secondCard = clicked;
    hasFlipped = false;

    tries++;
    triesSpan.textContent = tries;

    checkForMatch();
  }
});

// =======================
// CONTROLLO COPPIA
// =======================
function checkForMatch() {
  if (!firstCard || !secondCard) return;

  if (firstCard.dataset.name === secondCard.dataset.name) {
    matches++;
    matchesSpan.textContent = matches;

    const charName = firstCard.dataset.name;
    const quote = manzonianQuotes[charName] || "Una nuova tessera del romanzo è al suo posto.";
    messageEl.textContent = quote;

    // disattiva le due carte
    firstCard.style.pointerEvents = "none";
    secondCard.style.pointerEvents = "none";

    firstCard = null;
    secondCard = null;

    if (matches === totalPairs) handleVictory();
  } else {
    lockBoard = true;
    messageEl.textContent = "«Le trame si confondono… riprova!»";

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 800);
  }
}

// =======================
// VITTORIA
// =======================
function handleVictory() {
  gameOver = true;
  lockBoard = true;
  if (timerInterval) clearInterval(timerInterval);

  const doneText = isLastLevel()
    ? "«E così, dopo tanti casi, la vicenda si chiude a lieto fine.»<br>Hai completato la campagna!"
    : "«Un capitolo si chiude… e un altro attende.»<br>Livello superato!";

  messageEl.innerHTML = doneText;
  victoryOverlay.classList.remove("hidden");
}

// =======================
// BOTTONI
// =======================
resetBtn.addEventListener("click", () => initGame(currentLevel));

tryAgainBtn.addEventListener("click", () => initGame(currentLevel));

// Campagna: Prosegui => livello successivo; se ultimo => ricomincia stesso livello
playAgainBtn.addEventListener("click", () => {
  if (isLastLevel()) {
    initGame(currentLevel);           // "Gioca ancora"
  } else {
    initGame(nextLevelKey());         // "Prosegui"
  }
});

// Se cambi dal menu, inizi quel livello (e la campagna continua da lì)
levelSelect.addEventListener("change", e => {
  initGame(e.target.value);
});

// =======================
// AVVIO INIZIALE
// =======================
initGame(levelSelect.value || "medium");



