const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
document.getElementById('score').textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shufflecards();
    generateCards();
    console.log(cards);
  });

function shufflecards() {
  let randomindex;
  let currentindex = cards.length;
  let temp;

  while (currentindex !== 0) {
    randomindex = Math.floor(Math.random() * currentindex);
    currentindex--;
    temp = cards[currentindex];
    cards[currentindex] = cards[randomindex];
    cards[randomindex] = temp;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
        <img class="front-image" src=${card.image}>
    </div>
    <div class="back"></div>
    `;
    cardsContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;

  checkforMatch();
  document.getElementById('score').textContent = score;
}

function checkforMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
  } else {
    unflipCard();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  score++;
  if (score === 9)
    startConfetti();
  unlockBoard();
}
  
function unlockBoard(){
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function unflipCard() {
setTimeout(() => {  
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
}, 1000);
}

function restart(){
  shufflecards();
  unlockBoard();
  score = 0;
  stopConfetti();
  document.getElementById('score').textContent = score;
  cardsContainer.innerHTML = "";
  generateCards();
}
