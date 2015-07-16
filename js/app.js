/*
TODO: collisoin detection
TODO: reset game
*/

var DEBUG = false;

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
    setCollisionBox(this,2,111,97,32);

    // additional properties initialized in this.reset():
    // this.speed = measured in pixels per second
    // this.direction = DIR_R or DIR_L
    // this.sprite = the image for the bug (E_RIGHT or E_LEFT)
    // this.x = horizontal position
    // this.y = vertical position

    this.reset();

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var incr = this.speed * dt * this.direction;
    this.x += incr;
    if (this.exceedsMinMax()) {this.reset();}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// for a new enemy or an enemy that has moved off the screen we reset
// that enemy with new randomized properties
Enemy.prototype.reset = function () {
    this.y = this.randomY();
    this.speed = randomSpeed();
    this.direction = this.randomDirection();

    // assign the sprite per the direction the enemy is going
    this.sprite = (this.direction===DIR_R) ? E_RIGHT : E_LEFT;

    // move the enemy to the side opposite to the direction it is traveling
    this.x = (this.direction===DIR_R) ? E_XMIN : E_XMAX;
}

// determine if the enemy has moved off the screen
// returns TRUE when the enemy needs to be reset
Enemy.prototype.exceedsMinMax = function () {
    if (this.x < E_XMIN || this.x > E_XMAX) {return true;}
    return false;
}

Enemy.prototype.randomY = function () {
    return Math.random() * (E_YMAX - E_YMIN) + E_YMIN;
}

Enemy.prototype.randomDirection = function () {
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

function boxesCollide(box1, box2){
    if (box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y)
    { return true; }

    return false;
}

function setCollisionBox(entity, x, y, w, h){
    entity.boxOffsetX = x;
    entity.boxOffsetY = y;
    entity.boxWidth = w;
    entity.boxHeight = h
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 300;
    this.speed = 120; // measured in pixels per second
    this.score = 0.0;

    // the 'box' will be used for collision detection
    setCollisionBox(this, 34, 122, 34, 17);
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

    this.checkMinMax();
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 300;
}

// this method keeps the player from going off the screen
Player.prototype.checkMinMax = function () {
    if (this.x < XMIN) {this.x=XMIN;}
    if (this.x > XMAX) {this.x=XMAX;}

    if (this.y < YMIN) {this.y=YMIN;}
    if (this.y > YMAX) {this.y=YMAX;}
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


// GEMS!
// x,y min = 0,50
// x,y max = 480,515
var GEM_G = 'images/gem-green-small.png',
    GEM_B = 'images/gem-blue-small.png',
    GEM_O = 'images/gem-orange-small.png';

var Gem = function(){
    setCollisionBox(this, 0, 0, 24, 26);

    var gem = this.randomGem();

    if (gem === 'green'){
        this.initialize(GEM_G, 50, 3);
    }
    else if (gem === 'blue'){
        this.initialize(GEM_B, 25, 4.5);
    }
    else if (gem === 'orange'){
        this.initialize(GEM_O, 10, 6);
    }

    this.x = this.randomX();
    this.y = this.randomY();


}

Gem.prototype.randomX = function(){
    return randomNumber(0, 480);
}

Gem.prototype.randomY = function(){
    return randomNumber(50, 515);
}

Gem.prototype.initialize = function(img, pts, life){
    this.sprite = img;
    this.value = pts;
    this.lifespan = life;
    this.age = 0.0;
}

Gem.prototype.randomGem = function(){
    var num = randomNumber(1,100);

    if (num > 75){ return 'green';}
    else if (num > 50){ return 'blue';}
    else { return 'orange'};
}

Gem.prototype.update = function(dt){
    this.age += dt;
}

Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gem.prototype.reset = function(){
    // noop
}

Gem.prototype.expired = function(){

    if (this.age>this.lifespan) { return true;}
    return false;
}

var allGems = []
var gemGenerator = {};
gemGenerator.elapsed = 0.0;
gemGenerator.update = function(dt){
    this.elapsed += dt;
    if (this.elapsed > 2.0){
        this.elapsed = 0.0;
        allGems.push(new Gem());
    }
};


// Stars!
// x,y min =
// x,y max =


// Hearts!
// x,y min =
// x,y max =
