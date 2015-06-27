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

var LT = -1,
    EQ = 0,
    GT = 1;

// Enemies our player must avoid
var Enemy = function() {
    // the 'box' will be used for collision detection
    this.boxOffsetX = 2;
    this.boxOffsetY = 111;
    this.boxWidth = 97;
    this.boxHeight = 32;

    // additional properties initialized in resetEnemy(entity):
    // this.speed = measured in pixels per second
    // this.direction = DIR_R or DIR_L
    // this.sprite = the image for the bug (E_RIGHT or E_LEFT)
    // this.x = horizontal position
    // this.y = vertical position

    resetEnemy(this);

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var incr = this.speed * dt * this.direction;
    this.x += incr;
    if (checkEnemyMinMax(this)) {resetEnemy(this);}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// for a new enemy or an enemy that has moved off the screen we reset
// that enemy with new randomized properties
function resetEnemy(e) {
    e.y = randomEnemyY();
    e.speed = randomSpeed();
    e.direction = randomDirection();

    // assign the sprite per the direction the enemy is going
    e.sprite = (e.direction===DIR_R) ? E_RIGHT : E_LEFT;

    // move the enemy to the side opposite to the direction it is traveling
    e.x = (e.direction===DIR_R) ? E_XMIN : E_XMAX;
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

function calcBox(e) {
    var box = {};
    box.x = e.x + e.boxOffsetX;
    box.y = e.y + e.boxOffsetY;
    box.width = e.boxWidth;
    box.height = e.boxHeight;
    return box;
}

function boxCollision (box1, box2) {
    if (box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y)
    { return true; }

    return false;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 300;
    this.speed = 120; // measured in pixels per second

    // the 'box' will be used for collision detection
    this.boxOffsetX = 34;
    this.boxOffsetY = 122;
    this.boxWidth = 34;
    this.boxHeight = 17;
};

Player.prototype.update = function(dt) {
    this.handleInput(dt);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dt) {
    var incr = this.speed * dt;

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

function resetPlayer(p) {
    p.x = 200;
    p.y = 300;
}

// this method keeps the player from going off the screen
function checkPlayerMinMax(p) {
    if (p.x < XMIN) {p.x=XMIN;}
    if (p.x > XMAX) {p.x=XMAX;}

    if (p.y < YMIN) {p.y=YMIN;}
    if (p.y > YMAX) {p.y=YMAX;}
}

// Now instantiate your objects.
var allEntities = [];
for (var i=0; i<5; i++) {
    allEntities.push(new Enemy());
}

var player = new Player();
allEntities.push(player);

// This listens for key presses and tracks which keys are pressed at any given
// moment. The benfits of this approach are:
//      * We can handle multiple key presses at once
//      * We can control the speed of the player movement
//      * We avoid the split second delay that comes before key presses are
//        repeated when only relying on the keydown event
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
