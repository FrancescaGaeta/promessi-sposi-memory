// ==========================================
// CONFIGURAZIONE PERSONAGGI E CITAZIONI
// ==========================================
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

// ==========================================
// STATO DEL GIOCO E RIFERIMENTI DOM
// ==========================================
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

const board = document.querySelector(".game-board");
const triesSpan = document.getElementById("tries");
const matchesSpan = document.getElementById("matches");
const messageEl = document.getElementById("message");
const timerSpan = document.getElementById("timer");
const victoryOverlay = document.getElementById("victoryOverlay");
const defeatOverlay = document.getElementById("defeatOverlay");
const levelSelect = document.getElementById("levelSelect");

// ==========================================
// GESTIONE NARRATORE (Con Cambio Font)
// ==========================================
function updateNarrator(title, quote) {
  // Rimuoviamo l'animazione per resettarla
  messageEl.parentElement.classList.remove("fade-in");
  void messageEl.offsetWidth; // Trigger reflow

  // Costruiamo il contenuto con le classi per i nuovi font
  const html = `
    <div class="manzonian-font" style="font-size: 1.1rem; color: #7d5c3a; margin-bottom: 5px;">${title}</div>
    <div class="script-font">${quote}</div>
  `;
  
  messageEl.innerHTML = html;
  messageEl.parentElement.classList.add("fade-in");
}

// ==========================================
// INIZIALIZZAZIONE PARTITA
// ==========================================
function initGame(levelKey = levelSelect.value) {
  currentLevel = levelKey;
  const setNames = LEVEL_SETS[levelKey];
  const selected = setNames.map(name => originalCards.find(c => c.name === name));
  
  totalPairs = selected.length;
  document.getElementById("totalPairs").textContent = totalPairs;
  
  // Configurazione Griglia
  const cols = totalPairs <= 6 ? 4 : (totalPairs <= 10 ? 5 : 6);
  board.style.setProperty("--cols", cols);
  board.innerHTML = "";

  // Creazione Mazzo
  const deck = shuffle([...selected, ...selected]);

  deck.forEach(cardData => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = cardData.name;
    
    // Struttura HTML per effetto 3D e cornice esterna
    card.innerHTML = `
      <div class="inner">
        <div class="back"></div>
        <div class="front">
          <img src="img/${cardData.img}" alt="${cardData.name}">
        </div>
      </div>
    `;
    
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  resetGameState();
  startTimer();
  updateNarrator("L'Inizio", "«Quel ramo del lago di Como...»");
}

// ==========================================
// LOGICA DI GIOCO
// ==========================================
function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!hasFlipped) {
    hasFlipped = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  tries++;
  triesSpan.textContent = tries;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  matches++;
  matchesSpan.textContent = matches;
  
  const name = firstCard.dataset.name;
  updateNarrator(name, manzonianQuotes[name]);

  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  resetTurn();
  if (matches === totalPairs) {
    setTimeout(handleVictory, 800);
  }
}

function unflipCards() {
  lockBoard = true;
  updateNarrator("Il Caso", "«Le trame si confondono… cercate ancora.»");
  
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 1200);
}

// ==========================================
// UTILITY
// ==========================================
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function resetTurn() {
  [hasFlipped, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function resetGameState() {
  resetTurn();
  matches = 0;
  tries = 0;
  triesSpan.textContent = "0";
  matchesSpan.textContent = "0";
  
  clearInterval(timerInterval);
  // Tempo variabile per livello
  currentTime = currentLevel === "easy" ? 120 : (currentLevel === "medium" ? 180 : 240);
  updateTimerDisplay();
  
  victoryOverlay.classList.add("hidden");
  defeatOverlay.classList.add("hidden");
}

// ==========================================
// TIMER E OVERLAYS
// ==========================================
function startTimer() {
  timerInterval = setInterval(() => {
    currentTime--;
    updateTimerDisplay();
    if (currentTime <= 0) {
      clearInterval(timerInterval);
      handleDefeat();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const min = Math.floor(currentTime / 60);
  const sec = currentTime % 60;
  timerSpan.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function handleVictory() {
  clearInterval(timerInterval);
  victoryOverlay.classList.remove("hidden");
}

function handleDefeat() {
  lockBoard = true;
  defeatOverlay.classList.remove("hidden");
}

// ==========================================
// EVENT LISTENERS
// ==========================================
document.getElementById("resetBtn").addEventListener("click", () => initGame());
document.getElementById("playAgainBtn").addEventListener("click", () => initGame());
document.getElementById("tryAgainBtn").addEventListener("click", () => initGame());
levelSelect.addEventListener("change", (e) => initGame(e.target.value));

// AVVIO INIZIALE
window.onload = () => initGame();


