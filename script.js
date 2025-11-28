// PERSONAGGI
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

// FRASI MANZONIANE
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

// RIFERIMENTI AL DOM
let cardsData = [];
const board = document.querySelector(".game-board");
const triesSpan = document.getElementById("tries");
const matchesSpan = document.getElementById("matches");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

// VARIABILI DI STATO
let hasFlipped = false;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let tries = 0;
let matches = 0;
const totalPairs = originalCards.length;

// FUNZIONE DI INIZIALIZZAZIONE
function initGame() {
  board.innerHTML = "";

  // crea il mazzo (2 copie per ogni carta) e mescola
  cardsData = [...originalCards, ...originalCards];
  cardsData.sort(() => Math.random() - 0.5);

  // crea le carte nel DOM
  cardsData.forEach(cardInfo => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = cardInfo.name;

    // IMPORTANTE: struttura con .inner per il flip 3D
    card.innerHTML = `
      <div class="inner">
        <div class="back"></div>
        <img class="front" src="img/${cardInfo.img}" alt="${cardInfo.name}">
      </div>
    `;

    board.appendChild(card);
  });

  // reset stato
  hasFlipped = false;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  tries = 0;
  matches = 0;
  triesSpan.textContent = tries;
  matchesSpan.textContent = matches;
  messageEl.innerHTML = "«Quel ramo del lago di Como…»<br>Ricomincia la storia dei nostri promessi.";
}

// GESTIONE CLICK SULLA BOARD
board.addEventListener("click", e => {
  const clicked = e.target.closest(".card");
  if (!clicked) return;                     // clic fuori da una carta
  if (clicked.classList.contains("flipped")) return; // già girata
  if (lockBoard) return;                    // blocco temporaneo

  clicked.classList.add("flipped");

  if (!hasFlipped) {
    // prima carta girata
    hasFlipped = true;
    firstCard = clicked;
  } else {
    // seconda carta girata
    secondCard = clicked;
    hasFlipped = false;
    tries++;
    triesSpan.textContent = tries;

    checkForMatch();
  }
});

// CONTROLLO COPPIA
function checkForMatch() {
  if (!firstCard || !secondCard) return;

  if (firstCard.dataset.name === secondCard.dataset.name) {
    // COPPIA GIUSTA
    matches++;
    matchesSpan.textContent = matches;

    const charName = firstCard.dataset.name;
    const quote = manzonianQuotes[charName] || "Una nuova tessera del romanzo è al suo posto.";
    messageEl.textContent = quote;

    // disattiva definitivamente le due carte
    firstCard.style.pointerEvents = "none";
    secondCard.style.pointerEvents = "none";

    firstCard = null;
    secondCard = null;

    // tutte le coppie trovate
    if (matches === totalPairs) {
      messageEl.innerHTML = "«I nostri promessi, dopo tanti casi, giunsero finalmente a lieto fine.»<br>Hai trovato tutte le coppie!";
    }
  } else {
    // COPPIA SBAGLIATA
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

// BOTTONE RESET
resetBtn.addEventListener("click", initGame);

// AVVIO INIZIALE
initGame();

