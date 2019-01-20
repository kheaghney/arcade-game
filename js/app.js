/*
* Initialize variables to help with movements:
* rowHeight and colWidth give me the step lengths to be centered
  in the next block (row or column)
* rowZero and colZero help me identify where the first row (from the top)
  and the first column begin so I have a sense of my origin, adjusted for
  character/sprite height and width.
*/
var rowHeight = 83; 
var colWidth = 101; 
var yOffsetForChar = -23; // center the player/enemies in their row
var enemyRows = [
    // Array to store the rows for enemies to follow 
    // offset to help center the enemies in the rows
    yOffsetForChar + rowHeight,
    yOffsetForChar + rowHeight * 2,
    yOffsetForChar + rowHeight * 3
];
var enemySpeeds = [
    // Array to store the three speed levels for enemies
    getRandomInt(getRandomInt(1, 3), getRandomInt(4, 6)),
    getRandomInt(getRandomInt(4, 6), getRandomInt(8, 10)),
    getRandomInt(getRandomInt(8, 10), getRandomInt(15, 20))
];

    // MDN documentation for getRandomInt(),
    // returns a random integer between min & max,
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/* Enemy Class */
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Enemies randomly in a row (x) 
    this.x = getRandomInt(-101, 505);
    // Enemies randomly assigned a row (y)
    this.y = enemyRows[getRandomInt(0, 3)];
};

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x >= -colWidth && this.x < ctx.canvas.width + colWidth) {
        // function to determine enemy speed 
        this.x += this.speed(player.level) * (dt * 100 - 1);
    } else {
        // resets position of enemy 
        this.x = -colWidth;
        this.y = enemyRows[getRandomInt(0, 3)];
    }
};

Enemy.prototype.render = function() {
    // Draw the enemy on the screen, required method for game
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.speed = function(playerLvl) {
    // speed based on the player's level.
    if (playerLvl < 5) {
      
        return enemySpeeds[0];
    } else if (playerLvl < 9) {
        
        return enemySpeeds[1];
    } else {
        
        return enemySpeeds[2];
    }
};

/* Player Class */
var Player = function() {
    // Initialize player variables:
    this.sprite = 'images/char-boy.png';
    this.resetHome();  
    this.level = 1; 
    this.lives = 10; 
};

Player.prototype.render = function() {
    // render function proivded.
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
    // all movements handled in handleInput function.
};

Player.prototype.updateLives = function() {
    // Function to update lives
    this.lives -= 1;
};

Player.prototype.levelUp = function() {
    // Every even level you reach, a new enemy is added.
    this.level++;
    if (this.level % 2 === 0) {
        allEnemies.push(new Enemy()); // pushes new enemy into allEnemies array
    }
    this.resetHome(); // resets player position to home after you win 
};

Player.prototype.resetHome = function() {
    // Sets player to home position, called in various functions
    this.x = colWidth * 2;
    this.y = yOffsetForChar + rowHeight * 5;
};

Player.prototype.handleInput = function(key) {
    // Function recieves inputs from below, and processes the inputs accordingly
    if (key === 'up') {
        if (this.y === yOffsetForChar + rowHeight) {
            // checks for a win and resets player if won
            this.levelUp();
        } else {
            //checks if the players next move up is out of bounds
            this.y -= rowHeight;
        }
    } else if (key === 'down') {
        if ((this.y + rowHeight) <= (yOffsetForChar + rowHeight * 5)) {
            this.y += rowHeight;
        }
    } else if (key === 'left') {
        if (this.x - colWidth >= 0) {
            this.x -= colWidth;
        }
    } else if (key === 'right') {
        if ((this.x + colWidth) <= (colWidth * 4)) {
            this.x += colWidth;
        }
    } else {
        // blank for any unwanted implications
    }
};

/* Check Collisions */
function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        // Checks positions of each enemy on the board.
            if (enemy.y >= player.y - 50 &&
            enemy.y <= player.y + 50 &&
            enemy.x >= player.x - 65 &&
            enemy.x <= player.x + 65) {
            // decrease player's lives, return player home.
            player.updateLives();
            player.resetHome();
        }
    });
}

/* Initialize Objects */
var allEnemies = [
    // two enemies
    new Enemy(),
    new Enemy()
];
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});