// Memory Game Project JavaScript file

// Declare variables
let cardFaces = ["♣", "♦", "♥", "♠", "♤", "♡", "♢", "♧"]; // Choose exactly 8
let deck = []; // Populates on DOM initialization
let clickState = 0;
let stars = "★★★";
let guessCounter = 0;
let timer,
  timerSecondsBest = 99999,
  timerSeconds = 0;

// Initialize game after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  // Update copyright year
  let today = new Date();
  document.getElementById("thisYear").textContent = today.getUTCFullYear();
  // Start game
  populateDeck();
  addButtonClickEventListener("buttonNewGame", newGame);
  addButtonClickEventListener("buttonReset", newGame);
  newGame();
});

function addCardEventListeners() {
  // Add event listener to each card
  let cards = document.querySelectorAll(".card");
  for (let card of cards) {
    // TODO add code to ensure duplicate event listeners not added
    card.addEventListener("click", flipCard);
  }
}

function flipCard() {
  let cards = document.querySelectorAll(".card");
  // If card is currently facedown, flip it
  if (cardIsFacedown(this) === true) {
    if (clickState === 0) {
      flipFirstFacedownCard(this);
    } else if (clickState === 1) {
      flipSecondFacedownCard(this);
    }
  }
  // If game is complete, celebrate, update scoreboard, stop timer, etc.
  if (gameComplete() === true) {
    gameCompleteCelebration(cards);
    updateScoreboardRecords();
    stopTimer(); // Stop timer
  }
}

function flipNonMatches() {
  let cardsClicked = document.querySelectorAll(".clicked");
  let tempValues = [],
    match;
  // Read values of the last two flipped cards
  for (let card of cardsClicked) {
    tempValues.push(card.textContent);
  }
  // Compare values of the last two flipped cards
  match = tempValues[0] === tempValues[1];
  if (match) {
    // If they match, keep the cards showing
    for (let card of cardsClicked) {
      card.classList.remove("clicked");
      card.classList.add("matched");
      card.removeEventListener("click", flipCard);
    }
  } else {
    // Otherwise, flip them back over
    for (let card of cardsClicked) {
      setTimeout(() => {
        card.classList.remove("clicked");
      }, 500);
    }
  }
  clickState = 0;
}

function cardIsFacedown(card) {
  // Returns true if card is facedown otherwise false
  if (
    card.classList.contains("clicked") === false &&
    card.classList.contains("matched") === false
  ) {
    return true;
  } else {
    return false;
  }
}

function flipFirstFacedownCard(card) {
  // First facedown card clicked
  card.classList.toggle("clicked");
  clickState++;
}

function flipSecondFacedownCard(card) {
  // Second facedown card clicked
  card.classList.toggle("clicked");
  clickState++;
  flipNonMatches();
  guessCounter++;
  if (guessCounter === 20) {
    stars = "★★";
    document.getElementById("stars").textContent = stars;
  } else if (guessCounter === 32) {
    stars = "★";
    document.getElementById("stars").textContent = stars;
  }
  document.getElementById("moves").textContent = guessCounter;
}

function gameCompleteCelebration(cards) {
  // Add game stats to celebratory message
  document.getElementById("starsFinal").textContent = document.getElementById(
    "stars"
  ).textContent;
  document.getElementById("movesFinal").textContent = guessCounter;
  document.getElementById("timerFinal").textContent = document.getElementById(
    "timer"
  ).textContent;
  document.querySelector(".congratulations").classList.remove("displayNone");
  // Run celebratory animation
  for (let card of cards) {
    setTimeout(() => {
      card.classList.add("gameWon");
      card.classList.remove("matched");
    }, 300);
  }
}

function updateScoreboardRecords() {
  // Update moves scoreboard if new personal best achieved
  if (
    guessCounter < document.getElementById("movesBest").textContent ||
    document.getElementById("movesBest").textContent == "NA"
  ) {
    document.getElementById("movesBest").textContent = guessCounter;
  }
  // Update timer scoreboard if new personal best achieved
  if (
    timerSeconds < timerSecondsBest ||
    document.getElementById("timerBest").textContent == "NA"
  ) {
    timerSecondsBest = timerSeconds;
    document.getElementById("timerBest").textContent = document.getElementById(
      "timer"
    ).textContent;
  }
}

function addButtonClickEventListener(buttonID, myFunctionName) {
  // Adds event listener calling myFunctionName every time buttonID is clicked
  let myButton = document.querySelector(`#${buttonID}`);
  myButton.addEventListener("click", myFunctionName);
}

function newGame() {
  // Ensure timer is stopped
  stopTimer();
  // Calls all functions needed to start a new game
  addCardEventListeners();
  shuffle(deck);
  deal(deck);
  flipAllCardsFacedown();
  clickState = 0;
  stars = "★★★";
  document.getElementById("stars").textContent = stars;
  guessCounter = 0;
  document.getElementById("moves").textContent = guessCounter;
  document.getElementById("timer").textContent = "0:00";
  startTimer();
}

function startTimer() {
  // Starts the timer
  let minutesShown, secondsShown;
  timer = setInterval(() => {
    timerSeconds++;
    minutesShown = parseInt(timerSeconds / 60, 10);
    secondsShown = timerSeconds % 60;
    secondsShown = secondsShown < 10 ? `0${secondsShown}` : secondsShown;
    document.getElementById(
      "timer"
    ).textContent = `${minutesShown}:${secondsShown}`;
  }, 1000);
}

function stopTimer() {
  // Stops the timer
  clearTimeout(timer);
  timerSeconds = 0;
}

function flipAllCardsFacedown() {
  // Flips all cards facedown (by removing the class "clicked")
  let cards = document.querySelectorAll(".card");
  for (let card of cards) {
    card.classList.remove("clicked", "matched", "gameWon");
  }
  document.querySelector(".congratulations").classList.add("displayNone");
}

function deal(array) {
  // Deals cards to the UI
  let cards = document.querySelectorAll(".card");
  let i = 0;
  for (let card of cards) {
    card.textContent = array[i];
    i++;
  }
}

function shuffle(array) {
  // Performs a Fisher-Yates shuffle
  // More info @ https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  let maxIndex, randIndex;
  // Shuffle the cards
  for (let [index] of array.entries()) {
    maxIndex = array.length - 1;
    randIndex = getRandomInt(0, maxIndex);
    [array[randIndex], array[index]] = [array[index], array[randIndex]];
  }
}

function getRandomInt(min, max) {
  // Returns 1 random integer between min and max, inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function gameComplete() {
  // Checks if game is over
  let cards = document.querySelectorAll(".card");
  let matches = document.querySelectorAll(".matched");
  if (cards.length === matches.length) {
    // Return true if number of cards equals number of matched cards
    return true;
  } else {
    // Else return false
    return false;
  }
}

function populateDeck() {
  deck = cardFaces.concat(cardFaces);
  // Error handling
  if (cardFaces.length !== 8) {
    console.log(
      "Error: cardFaces must contain exactly 8 card types. Go to main.js and ensure that this is so."
    );
  }
}
