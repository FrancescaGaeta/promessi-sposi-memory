// 1. Carte base (una per tipo, con nome + immagine)
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

// 2. Creiamo il mazzo completo (due copie di ogni carta)
let cardsData = [...originalCards, ...originalCards];

const board = document.querySelector(".game-board");

// 3. Mischia le carte
cardsData.sort(() => Math.random() - 0.5);

// 4. Crea le carte nel DOM
cardsData.forEach(cardInfo => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.name = cardInfo.name;

  // HTML interno: retro (span) + fronte (img)
  card.innerHTML = `
    <span class="back">?</span>
    <img class="front" src="img/${cardInfo.img}" alt="${cardInfo.name}">
  `;

  board.appendChild(card);
});

let hasFlipped = false;
let firstCard, secondCard;
let lockBoard = false;

// 5. Logica di gioco
board.addEventListener("click", e => {
  const clicked = e.target.closest(".card");
  if (!clicked) return;
  if (clicked.classList.contains("flipped") || lockBoard) return;

  clicked.classList.add("flipped");

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
      // Coppia sbagliata: rigira dopo un attimo
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        lockBoard = false;
      }, 800);
    }
  }
});
