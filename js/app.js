/*
TODO: animate bug
    TODO: randomize y value on position reset
TODO: collisoin detection
TODO: reset game
*/

// Constant variables
var XMIN = -17,
    YMIN = -13,
    XMAX = 420,
    YMAX = 405
    XY_INCREMENT = 1;

var E_XMIN = -100;
var E_XMAX = 505;
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = 60;
    this.ppSec = 90;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var incr = this.ppSec * dt;
    this.x += incr;
    checkEnemyMinMax(this);
}

function checkEnemyMinMax(e) {
    if (e.x < E_XMIN) {e.x = E_XMIN;}
    if (e.x > E_XMAX) {e.x = E_XMIN;}
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
    this.ppSec = 120; // speed of player movement in pixels per second
};

Player.prototype.update = function(dt) {
    player.handleInput(dt);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

Player.prototype.handleInput = function(dt) {
    var incr = this.ppSec * dt;

    if (keyStates[LEFT]) {
        this.x -= incr;
    }
    if (keyStates[RIGHT]) {
        this.x += incr;
    }
    if (keyStates[UP]) {
        this.y -= incr;
    }
    if (keyStates[DOWN]) {
        this.y += incr;
    }

    checkPlayerMinMax(this);
};

function checkPlayerMinMax(p) {
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
