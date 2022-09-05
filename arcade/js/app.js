// Original source for much of the following code: https://github.com/udacity/frontend-nanodegree-arcade-game
// Date: 10/24/18
// THANK YOU to the Udacity authors for this original code

// Global parameters
const CANVAS_X = 505;
const CANVAS_Y = 606;
const ROWS = 7; // inclused 0.5 unusable row at top and bottom
const COLUMNS = 5;
const X_BLOCK_LEN = CANVAS_X / COLUMNS;
const Y_BLOCK_LEN = CANVAS_Y / ROWS;
const X_MIN = X_BLOCK_LEN * 0.5;
const X_MAX = X_BLOCK_LEN * (COLUMNS - 2);
const yMin = Y_BLOCK_LEN * 0.5;
const Y_MAX = Y_BLOCK_LEN * (ROWS - 3);
const COLLISION_COEFFICIENT = 0.7;

// Getting a random integer between 2 numbers, [min, max)
// source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// October 17, 2018
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Getting a random integer between 2 numbers, inclusive
// source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// October 17, 2018
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// Enemies our player must avoid
let Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";

  // Speed between 0.5 and 2
  this.speed = Math.random() * (2 - 0.5) + 0.5;

  // Vertical position; 0 = top *stone* row
  // 1 = middle
  // 2 = bottom
  this.x = -X_BLOCK_LEN;
  this.y = Y_BLOCK_LEN * (getRandomIntInclusive(1, 3) - 0.5);
};

Enemy.prototype.reinitialize = function() {
  this.speed = Math.random() * (2 - 0.5) + 0.5;
  this.x = -X_BLOCK_LEN;
  this.y = Y_BLOCK_LEN * (getRandomIntInclusive(1, 3) - 0.5);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += 3 * dt;

  // Reinitialize enemy if offscreen
  if (this.x > CANVAS_X) {
    this.reinitialize();
  }

  // Handle collision with player if occurs
  let xDist = Math.abs(this.x - player.x);
  let yDist = Math.abs(this.y - player.y);
  let xCollisionDistance = X_BLOCK_LEN * COLLISION_COEFFICIENT;
  let yCollisionDistance = X_BLOCK_LEN * COLLISION_COEFFICIENT;
  if (xDist <= xCollisionDistance && yDist <= yCollisionDistance) {
    player.reinitialize();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // TODO Refactor
  // Comment from Udacity 10/18/18:
  // If you take a look at this line and at the Player.render method, 
  // you could see that both are pretty similar. Also, both Player 
  // and Enemy have x, y and sprite properties. This means you could 
  // create a superclass (for example: 'character') with those common 
  // properties and method and then make Player and Enemy subclasses 
  // of "character" using inheritance.
  setInterval(this.update(this.speed), 100);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor() {
    let spriteImages = [
      "images/char-boy.png",
      "images/char-cat-girl.png",
      "images/char-horn-girl.png",
      "images/char-pink-girl.png",
      "images/char-princess-girl.png"
    ];
    let randSpriteNo = getRandomInt(0, spriteImages.length);
    this.sprite = "images/char-boy.png";
    this.x = 2 * X_BLOCK_LEN;
    this.y = 4.5 * Y_BLOCK_LEN;
  }

  // Methods
  update(key) {
    // Move up/down within limits
    if (key == "up" && this.y >= yMin) {
      this.y -= Y_BLOCK_LEN;
    } else if (key == "down" && this.y <= Y_MAX) {
      this.y += Y_BLOCK_LEN;
    }

    // Move left/right within limits
    if (key == "left" && this.x >= X_MIN) {
      this.x -= X_BLOCK_LEN;
    } else if (key == "right" && this.x <= X_MAX) {
      this.x += X_BLOCK_LEN;
    }

    // Win (reinitialize) if made it to top row (water)
    if (this.y < yMin) {
      this.reinitialize();
    }
  }

  reinitialize() {
    this.x = 2 * X_BLOCK_LEN;
    this.y = 4.5 * Y_BLOCK_LEN;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(key) {
    console.log(key);
    if (key == "up") {
      this.update("up");
    } else if (key == "left") {
      this.update("left");
    } else if (key == "right") {
      this.update("right");
    } else if (key == "down") {
      this.update("down");
    }
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let enemy1 = new Enemy();
let enemy2 = new Enemy();
let enemy3 = new Enemy();
let enemy4 = new Enemy();

let allEnemies = [enemy1, enemy2, enemy3, enemy4];

let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
