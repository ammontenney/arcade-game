/*
TODO: animate bug
TODO: collisoin detection
TODO: reset game
TODO: enable multi-key press
*/

// Constant variables
var XMIN = -17,
    YMIN = -13,
    XMAX = 420,
    YMAX = 405
    XY_INCREMENT = 1;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 100;
    this.y = 100;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 200;
};

Player.prototype.update = function(dt) {
    player.handleInput(keyStates);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

Player.prototype.handleInput = function(keys) {
    if (keys[LEFT]) {
        this.x -= XY_INCREMENT;
    }
    if (keys[RIGHT]) {
        this.x += XY_INCREMENT;
    }
    if (keys[UP]) {
        this.y -= XY_INCREMENT;
    }
    if (keys[DOWN]) {
        this.y += XY_INCREMENT;
    }

    checkMinMax(this);
};

function checkMinMax(p) {
    if (p.x < XMIN) {p.x=XMIN;}
    if (p.x > XMAX) {p.x=XMAX;}

    if (p.y < YMIN) {p.y=YMIN;}
    if (p.y > YMAX) {p.y=YMAX;}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy()];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

var LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40;
var keyStates = {LEFT:false, RIGHT:false, UP:false, DOWN:false};

document.addEventListener('keydown', function(e){
    keyStates[e.keyCode] = true;
});

document.addEventListener('keyup', function(e){
    keyStates[e.keyCode] = false;
});
