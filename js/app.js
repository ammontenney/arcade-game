
 // Toggle this value to show FPS and entity collision boxes
var DEBUG = false;

/* global ctx */
/* global Resources */
/* global document */


////////////////////////////////
// Define Constant variables  //
////////////////////////////////
var XMIN = -17,
    YMIN = -70, //-13,
    XMAX = 420,
    YMAX = 405;

var E_XMIN = -100,
    E_XMAX = 505,
    E_YMIN = 30,
    E_YMAX = 330,
    E_RIGHT = 'images/enemy-bug-r.png',
    E_LEFT = 'images/enemy-bug-l.png';

var BOY = 'images/char-boy.png',
    BOY_STAR = 'images/char-boy-star.png';

var DIR_R = 1,
    DIR_L = -1;



/////////////////////////////////////////////////////////////
// The Player, Enemy, and Item classes inherit from Sprite //
// Sprite's main purpose is to enable collision detection  //
/////////////////////////////////////////////////////////////
var Sprite = function(){
    this.setBox(0,0,1,1);
};

// This identifies the area withing a sprite that will be
// used to calculate collision
Sprite.prototype.setBox = function(x,y,w,h){
    this.boxOffsetX = x;
    this.boxOffsetY = y;
    this.boxWidth = w;
    this.boxHeight = h;
};

// Returns an object of the collision box with the properties:
// x, y, width, height
Sprite.prototype.box = function(){
    var box = {};
    box.x = this.x + this.boxOffsetX;
    box.y = this.y + this.boxOffsetY;
    box.width = this.boxWidth;
    box.height = this.boxHeight;
    return box;
};

// Compares the boxes of two Sprites and returns true if they collide
Sprite.prototype.collides = function(otherSprite){
    var box1 = this.box();
    var box2 = otherSprite.box();

    if (box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y)
    { return true; }

    return false;
};

///////////////////////////////////////////////////////
// Enemies our player must avoid. Subclass of Sprite //
///////////////////////////////////////////////////////
var Enemy = function() {
    this.setBox(2,111,97,32);

    this.reset();
    // properties initialized in this.reset():
        // this.speed = measured in pixels per second
        // this.direction = DIR_R or DIR_L
        // this.img = the image for the bug (E_RIGHT or E_LEFT)
        // this.x = horizontal position
        // this.y = vertical position
};
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks in seconds
Enemy.prototype.update = function(dt) {
    var incr = this.speed * dt * this.direction;
    this.x += incr;
    if (this.exceedsMinMax()) {this.reset();}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.img), this.x, this.y);
};

// for a new enemy or an enemy that has moved off the screen we reset
// that enemy with new randomized properties
Enemy.prototype.reset = function () {
    this.y = this.randomY();
    this.speed = randomSpeed();
    this.direction = this.randomDirection();

    // assign the sprite per the direction the enemy is going
    this.img = (this.direction===DIR_R) ? E_RIGHT : E_LEFT;

    // move the enemy to the side opposite to the direction it is traveling
    this.x = (this.direction===DIR_R) ? E_XMIN : E_XMAX;
};

// determine if the enemy has moved off the screen
// returns TRUE when the enemy needs to be reset
Enemy.prototype.exceedsMinMax = function () {
    if (this.x < E_XMIN || this.x > E_XMAX) {return true;}
    return false;
};

Enemy.prototype.randomY = function () {
    return Math.random() * (E_YMAX - E_YMIN) + E_YMIN;
};

Enemy.prototype.randomDirection = function () {
    var rand = randomNumber(1,2);
    if (rand === 1){return DIR_R;}
    else {return DIR_L;}
};


//////////////////////////////////////
// Player class. Subclass of Sprite //
//////////////////////////////////////
var Player = function(){
    // the 'box' will be used for collision detection
    this.setBox(34, 122, 34, 17);
    // reset sets the initial position of the player
    this.reset();
    this.img = BOY;
    // this.img = E_RIGHT;

    this.speed = 120; // measured in pixels per second
    this.score = 0.0;
    this.noKillTime = 0.0;
    this.lives = 3;
};
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    this.handleInput(dt);
    if (this.noKillTime > 0.0){
        this.noKillTime -= dt;
        this.img = BOY_STAR;
    }
    else {
        this.img = BOY;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.img), this.x, this.y);
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

// Resets the position of the player when he dies.
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 405;
};

// this method keeps the player from going off the screen
Player.prototype.checkMinMax = function(){
    if (this.x < XMIN) {this.x=XMIN;}
    if (this.x > XMAX) {this.x=XMAX;}

    if (this.y < YMIN) {this.y=YMIN;}
    if (this.y > YMAX) {this.y=YMAX;}
};

Player.prototype.invincible = function(){
    if (this.noKillTime > 0.0){ return true; }
    else { return false; }
};

////////////////////////////////////////////////////
// Items that the Player can pickup to get points //
////////////////////////////////////////////////////

// A few more constants for our sprite images
var GEM_G = 'images/gem-green-small.png',
    GEM_B = 'images/gem-blue-small.png',
    GEM_O = 'images/gem-orange-small.png',
    HEART = 'images/heart-small.png',
    STAR  = 'images/star-small.png';

var Item = function(){
    this.setBox(0, 0, 24, 26);
    this.type = this.randomType();
    this.initializeItem();

    // give the new item a random location
    this.x = this.randomX();
    this.y = this.randomY();

    // Gems in the water have a longer lifespan
    if (this.collides(waterArea) &&
        this.type !== 'heart' &&
        this.type !=='star'){ this.lifespan = 30; }
};
Item.prototype = Object.create(Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.initializeItem = function(){
    if (this.type === 'star'){
        this.initialize(STAR, 0, 3);
        this.action = function(){player.noKillTime = 10;};
    }
    else if (this.type === 'heart'){
        this.initialize(HEART, 0, 3);
        this.action = function(){player.lives++;};
    }
    else if (this.type === 'orange'){
        this.initialize(GEM_O, 50, 3);
    }
    else if (this.type === 'blue'){
        this.initialize(GEM_B, 25, 4.5);
    }
    else { // (this.type === 'green')
        this.initialize(GEM_G, 10, 6);
    }
};

Item.prototype.action = function(){
    player.score += this.value;
};

Item.prototype.randomType = function(){
    var num = randomNumber(1,100);

    // probability of each item by percentage
    // star = 5%
    // heart = 5%
    // orange = 15%
    // blue = 25%
    // green = 50%
    if (num > 95){ return 'star';}
    else if (num > 90){ return 'heart';}
    else if (num > 75){ return 'orange';}
    else if (num > 50){ return 'blue';}
    else { return 'green';}
};

Item.prototype.initialize = function(img, pts, lifespan){
    this.img = img;
    this.value = pts;
    this.lifespan = lifespan;
    this.age = 0.0;
};

Item.prototype.randomX = function(){
    // x min = 0
    // x max = 480
    return randomNumber(0, 480);
};

Item.prototype.randomY = function(){
    // y min = 50
    // y max = 515
    return randomNumber(50, 515);
};

Item.prototype.update = function(dt){
    this.age += dt;
};

Item.prototype.render = function(){
    ctx.drawImage(Resources.get(this.img), this.x, this.y);
};

Item.prototype.reset = function(){
    // noop
};

// lets us know when a item should disappear from the screen
Item.prototype.expired = function(){
    if (this.age>this.lifespan) {return true;}
    return false;
};

////////////////////////////////////////////////////////////////////////////
// Below are general purpose functions that are used by the classes above //
////////////////////////////////////////////////////////////////////////////

// return a number between 1 & 10 and multiply by 30 px/sec
function randomSpeed() {
    return randomNumber(1, 10) * 30;
}

// return a number from min to max inclusive
function randomNumber(min, max) {
    var scale = max - min + 1;
    return Math.floor(Math.random()*scale) + min;
}

/////////////////////////////////////////////////////////////////////
// The itemGenerator is used to produce random items every second  //
/////////////////////////////////////////////////////////////////////
var itemGenerator = {'time':0.0};
itemGenerator.update = function(dt){
    this.time += dt;
    if (this.time > 1.0){
        this.time = 0.0;
        allItems.push(new Item());
    }
};


//////////////////////////////////////////////////////////////////////
// This object is used to control the alternating of when items are //
// to be drawn on top of all other entities (player & enemies).     //
// Items are always drawn behind the entities, but are only drawn   //
// on top of the entities half of the time to create a flashing     //
// effect to indicate to the user that an item is being covered by  //
// an entity.                                                       //
//////////////////////////////////////////////////////////////////////
var itemFlashManager = {'flashing':false, 'time':0.0};
itemFlashManager.update = function(dt){
    this.time += dt;
    if (this.time > 0.2){
        this.time = 0;
        this.flashing = this.flashing ? false : true;
    }
};

////////////////////////////////////////////////////////////////
// This object is used to calculate the FPS at which the game //
// is performing. This is helpful in identifying changes that //
// impact performance of the game.                            //
////////////////////////////////////////////////////////////////
var fpsManager = {'time':0.0, 'frames':0.0, 'fps':0.0};
fpsManager.update = function(dt){
    this.time += dt;
    this.frames++;
    if (this.time>1.0){
        this.fps = this.frames / this.time;
        this.time = 0.0;
        this.frames = 0.0;
    }
};


/////////////////////////////////////
// Here we instantiate our objects //
/////////////////////////////////////
var player = {};
var allEntities = [];
var allItems = [];

var waterArea = new Sprite();
waterArea.x = 0;
waterArea.y = 0;
waterArea.width = 505;
waterArea.height = 130;
waterArea.setBox(0,0,505,130);

initializeApp();

function initializeApp(){
    player = new Player();

    allEntities = [];
    allEntities.push(player);

    for (var i=0; i<5; i++) {
        allEntities.push(new Enemy());
    }

    allItems = [];
}





////////////////////////////////////////////////////////////////////////////
// This section listens for key presses and tracks which keys are pressed //
// at any given moment. The benfits of this approach are:                 //
//      * We can handle multiple key presses at once                      //
//      * We can control the speed of the player movement                 //
//      * We avoid the split second delay that comes before key presses   //
//        are repeated when only relying on the keydown event             //
////////////////////////////////////////////////////////////////////////////
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
