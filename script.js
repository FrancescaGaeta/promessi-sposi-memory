// Dati delle carte: ogni nome compare due volte
const cardsData = [
  { name: "Renzo", img: "renzo.png" },
  { name: "Lucia", img: "lucia.png" },
  { name: "DonRodrigo", img: "don-rodrigo.png" },
  { name: "FraCristoforo", img: "fra-cristoforo.png" }
];

const board = document.querySelector(".game-board");

// Mischia le carte
cardsData.sort(() => Math.random() - 0.5);

// Crea le carte nel DOM
cardsData.forEach(name => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.name = name;
  card.innerText = "?";
  board.appendChild(card);
});

let hasFlipped = false;
let firstCard, secondCard;
let lockBoard = false;

// Logica di gioco
board.addEventListener("click", e => {
  const clicked = e.target;

  // clic non su una carta
  if (!clicked.classList.contains("card")) return;
  // evita doppio click sulla stessa carta o mentre stiamo aspettando di rigirarle
  if (clicked.classList.contains("flipped") || lockBoard) return;

  clicked.classList.add("flipped");
  clicked.innerText = clicked.dataset.name;

  if (!hasFlipped) {
    hasFlipped = true;
    firstCard = clicked;
  } else {
    secondCard = clicked;
    hasFlipped = false;

    if (firstCard.dataset.name === secondCard.dataset.name) {
      // Coppia corretta: disabilita i click
      firstCard.style.pointerEvents = "none";
      secondCard.style.pointerEvents = "none";
    } else {
      // Coppia sbagliata: aspetta un attimo e rigira
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        firstCard.innerText = "?";
        secondCard.classList.remove("flipped");
        secondCard.innerText = "?";
        lockBoard = false;
      }, 800);
    }
  }
});