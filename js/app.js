/*
TODO: collisoin detection
TODO: reset game
*/

// Constant variables
var XMIN = -17,
    YMIN = -13,
    XMAX = 420,
    YMAX = 405;

var E_XMIN = -100,
    E_XMAX = 505,
    E_YMIN = 30,
    E_YMAX = 240,
    E_RIGHT = 'images/enemy-bug-r.png',
    E_LEFT = 'images/enemy-bug-l.png';

var DIR_R = 1,
    DIR_L = -1;

// Enemies our player must avoid
var Enemy = function() {
    /* Properties:
        ppSec = pixels per second
        direction = 1 or -1 (1 is right, -1 is left)
        sprite = the image for the bug (left or right)
    */
    resetEnemy(this);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var incr = this.ppSec * dt*this.direction;
    this.x += incr;
    if (checkEnemyMinMax(this)) {resetEnemy(this);}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

function resetEnemy(e) {
    e.ppSec = randomSpeed();
    e.direction = randomDirection();
    // assign the sprite per the direction the enemy is going
    e.sprite = (e.direction===DIR_R) ? E_RIGHT : E_LEFT;
    // move the enemy to the side opposite to the direction it is traveling
    e.x = (e.direction===DIR_R) ? E_XMIN : E_XMAX;
    e.y = randomEnemyY();
}

// determine if the enemy has moved off the screen
// returns TRUE when the enemy needs to be reset
function checkEnemyMinMax(e) {
    if (e.x < E_XMIN || e.x > E_XMAX) {return true;}
    return false;
}

function randomEnemyY() {
    return Math.random() * (E_YMAX - E_YMIN) + E_YMIN;
}

function randomDirection() {
    var rand = randomNumber(1,2);
    if (rand === 1){return 1}
    else {return -1;}
}

// return a number between 1 & 10 and multiply by 30 px/sec
function randomSpeed() {
    return randomNumber(1, 10) * 30;
}

// return a number from min to max inclusive
function randomNumber(min, max) {
    var scale = max - min + 1;
    return Math.floor(Math.random()*scale) + min;
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


var allEnemies = [];//[new Enemy()];
for (var i=0; i<5; i++) {
    allEnemies.push(new Enemy());
}

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
