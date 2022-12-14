// ** IN PROGRESS **
// TODO - research rules for what happens when player and/or house hits "Blackjack"
// TODO - add hand-splitting button & functionality when user draws a pair
// TODO - add betting

// ** BACK BURNER **
// TODO - let the user pick the number of decks used

// ** DONE **
// TODO - add additional computer characters and colors
// TODO - add "Blackjack" exclamation if a blackjack
// TODO - add better scoring for Aces
// TODO - add record of wins & losses
// TODO - add "You went bust" and auto-complete game if user hits to get 22 or more points
// TODO - fix bug where house always considers Ace to be 1 point (should be flexible & recognize Blackjacks)
// TODO - add keyboard controls

// Variables
const strSpade = "♠";
const strClub = "♣";
const strDiamond = "♦";
const strHeart = "♥";
const suits = [strSpade, strClub, strDiamond, strHeart];
const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const scoresA1 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1];
// const scoresA11 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]
let deck = [];
let gameStatus = 1; // game status. 1=ongoing. 0=over.
let player;
let house;
let scoreboard = [0, 0, 0]; // wins | pushes | losses

// Objects
function Player() {
  this.cards = [];
  this.scores = [];
  this.draw = function() {
    let tempArray = pickupTopCard();
    let message = document.getElementById("playerHand");
    message.innerHTML = "";
    // console.log(tempArray);
    // add card & register score
    try {
      this.cards.push(tempArray[0]);
      this.scores.push(tempArray[1]);
    } catch (err) {
      message.innerHTML = "Error: No more cards left in deck. Start Over.";
    }
  };
  this.hit = function() {
    // alias for draw
    this.draw();
  };
  // this.split = function () {
  //     // TODO - write this function
  // }
  this.show = function(showOneCardOnly = false) {
    let cardsTemp = [];
    let returnArray = [];
    let strHTML = "";

    if (showOneCardOnly === false) {
      cardsTemp.push(...this.cards);
    } else {
      cardsTemp.push(this.cards[0]);
    }

    for (let card of cardsTemp) {
      if (redCard(card)) {
        strHTML += "<span class='card red'>";
        strHTML += card;
        strHTML += "</span>";
      } else {
        strHTML += "<span class='card'>";
        strHTML += card;
        strHTML += "</span>";
      }
      returnArray.push(strHTML);
      strHTML = " ";
    }
    return returnArray.join("");
  };
  this.stand = function() {
    // do not add a card & end the game
  };
  this.score = function() {
    let numSum = arraySum(this.scores);
    let ace = hasAce(this.cards);
    // note: scores by default include Ace === 1 point
    if (numSum > 11) {
      return numSum; // if score > 11, ace must equal 1 point, else bust. Report score.
    } else if (ace === 0) {
      return numSum; // if no ace, then ace scoring is irrelevant. Report score.
    } else if (ace === 1) {
      return numSum + 10; // if ace and score is 11 or less, report score plus 10.
    }
  };
  this.score1 = function() {
    let aceShowing = hasAce(this.cards[0]);
    if (aceShowing === 0) {
      return this.scores[0]; // if no ace, then ace scoring is irrelevant. Report score.
    } else if (aceShowing === 1) {
      return this.scores[0] + 10; // if ace and score is 11 or less, report score plus 10.
    }
  };
  this.hitWhileLessThan17 = function() {
    let ace, myScore;
    do {
      // SCORE
      // 1. What's my score assuming Aces are 1 point?
      myScore = arraySum(this.scores);
      // 2. Do I have an ace?
      ace = hasAce(this.cards);
      // 3. Do I have an ace with less than 12 points? If yes, add 10 to score.
      if (ace === 1 && myScore < 12) {
        myScore += 10;
      }
      // DRAW if my score is less than 17.
      if (myScore < 17) {
        this.draw();
      }
      // RE-SCORE
      myScore = arraySum(this.scores);
      ace = hasAce(this.cards);
      if (ace === 1 && myScore < 12) {
        myScore += 10;
      }
    } while (myScore < 17);
  };
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Update copyright year
  let today = new Date();
  document.getElementById("thisYear").textContent = today.getUTCFullYear();
  // Start the game
  start();
});

$("#hit").click(function() {
  hit();
});

// $('#split').click(function () {
//     split();
// });

$("#stand").click(function() {
  stand();
});

$("#newGame").click(function() {
  start();
});

$("body").keypress(function(event) {
  // console.log(event.which);
  if (event.which === 49) {
    // 1 key = hit()
    hit();
  } else if (event.which === 50) {
    // 2 key = stand()
    stand();
  } else if (event.which === 51) {
    // 3 key = next game
    start();
  }
});

// Functions
function start() {
  player = new Player();
  house = new Player();
  gameStatus = 1;
  // generate deck; e.g., shuffle(1) means using 1 deck of 52 cards,
  // shuffle(2) means using 2 decks of 52 cards, etc.
  shuffle(1);
  // console.log(...deck);
  // deal the cards
  player.draw();
  house.draw();
  player.draw();
  house.draw();
  // console.log cards
  // console.log('***New Game***');
  // console.log(`Player: ${player.show()}.
  // Score: ${player.score()}`);
  // display cards
  $("#houseHand").empty();
  $("#houseHand").append(`${house.show(true)} <span class="subtle">[?]</span>`);
  $("#housePoints").text(`${house.score1()}`);
  $("#playerHand").empty();
  $("#playerHand").append(`${player.show()}`);
  $("#playerPoints").text(`${player.score()}`);
  $("#result").empty();
  // ensure hit and stand buttons are enabled to start game
  $("#hit").prop("disabled", false);
  $("#stand").prop("disabled", false);
  $("#scoreboard").text(
    `${[scoreboard[0]]}-${[scoreboard[2]]}-${[scoreboard[1]]}`
  );
  // print "Blackjack!" message if player got a blackjack
  if (player.score() === 21) {
    stand();
    $("#playerHand").append(`. Blackjack!`);
  }
  return null;
}

function stand() {
  let result = [];
  let houseBlackjack = false;
  if (gameStatus === 1) {
    // Show "Blackjack"
    if (house.score() === 21) {
      houseBlackjack = true;
    }
    // Make sure house hits until they have 17 or more points
    house.hitWhileLessThan17();
    // console.log cards
    // console.log(`House: ${house.show()}.
    // Score: ${house.score()}`);
    // display cards
    $("#playerHand").empty();
    $("#playerHand").append(`${player.show()}`);
    $("#playerPoints").text(`${player.score()}`);
    $("#houseHand").empty();
    $("#houseHand").append(`${house.show()}`);
    if (houseBlackjack === true) {
      $("#houseHand").append(`. Blackjack!`);
    }
    $("#housePoints").text(`${house.score()}`);
    // calculate result
    result = scoreGame(player.score(), house.score());
    // display result & scoreboard
    $("#result").text(result[3]);
    // console.log(result[3]);
    scoreboard[0] += result[0];
    scoreboard[1] += result[1];
    scoreboard[2] += result[2];
    $("#scoreboard").text(
      `${[scoreboard[0]]}-${[scoreboard[2]]}-${[scoreboard[1]]}`
    );
    // disable the hit and stand buttons until new game is started
    $("#hit").prop("disabled", true);
    $("#stand").prop("disabled", true);
  }
  gameStatus = 0;
  return null;
}

function hit() {
  if (gameStatus === 1) {
    player.hit();
    // console.log cards
    // console.log(`Player: ${player.show()}.
    // Score: ${player.score()}`);
    // display cards
    $("#playerHand").empty();
    $("#playerHand").append(`${player.show()}`);
    $("#playerPoints").text(`${player.score()}`);
    // stop the game if player went bust
    if (player.score() > 21) {
      stand();
    }
  }
  return null;
}

function getRandomInt(min, max) {
  // return 1 random integer between min and max
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function shuffle(decks) {
  // empty deck
  deck = [];
  // generate deck
  for (let i = 0; i < decks; i++) {
    for (let suit of suits) {
      let j = 0;
      for (let face of faces) {
        deck.push([`${face}${suit}`, scoresA1[j]]);
        j++;
      }
    }
  }
  return null;
}

function pickupTopCard() {
  // declare variables
  let randIndex = Math.floor(Math.random() * deck.length);
  // return card
  if (deck.length >= 1) {
    return deck.splice(randIndex, 1)[0]; // Take this card out of the deck.
  } else if (deck.length === 0) {
    return null; // Error: no cards left to take out of the deck.
  }
}

function arraySum(nums) {
  let numTot = 0;
  for (let num of nums) {
    numTot += num;
  }
  return numTot;
}

function scoreGame(player, house) {
  if (player <= 21 && house <= 21) {
    if (player > house) {
      return [1, 0, 0, "Congratulations, you won!"];
    } else if (player === house) {
      return [0, 1, 0, "You tied: it's a push."];
    } else if (player < house) {
      return [0, 0, 1, "Sorry, you lost."];
    }
  } else if (player > 21 && house <= 21) {
    return [0, 0, 1, "You went bust."];
  } else if (player > 21 && house > 21) {
    return [0, 1, 0, "You both went bust: it's a push."];
  } else if (player <= 21 && house > 21) {
    return [1, 0, 0, "The house went bust. You won!"];
  }
}

function hasAce(cards) {
  let hasAce = 0;
  for (let card of cards) {
    if (card.substring(0, 1) == "A") {
      hasAce = 1;
    }
  }
  return hasAce;
}

function redCard(card) {
  let isRed = false;
  if (card.includes(strDiamond, 0)) {
    isRed = true;
  } else if (card.includes(strHeart, 0)) {
    isRed = true;
  }
  return isRed;
}
