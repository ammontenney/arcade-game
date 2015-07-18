
 // Toggle this value to show FPS and entity collision boxes
var DEBUG = false;

////////////////////////////////
// Define Constant variables  //
////////////////////////////////
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

////////////////////////////////////////////////////////////
// The Player, Enemy, and Gem classes inherit from Sprite //
// Sprite's main purpose is to enable collision detection //
////////////////////////////////////////////////////////////
var Sprite = function(){
    this.setBox(0,0,1,1);
}

// This identifies the area withing a sprite that will be
// used to calculate collision
Sprite.prototype.setBox = function(x,y,w,h){
    this.boxOffsetX = x;
    this.boxOffsetY = y;
    this.boxWidth = w;
    this.boxHeight = h;
}

// Returns an object of the collision box with the properties:
// x, y, width, height
Sprite.prototype.box = function(){
    var box = {};
    box.x = this.x + this.boxOffsetX;
    box.y = this.y + this.boxOffsetY;
    box.width = this.boxWidth;
    box.height = this.boxHeight;
    return box;
}

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
}

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
}
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks in seconds
Enemy.prototype.update = function(dt) {
    var incr = this.speed * dt * this.direction;
    this.x += incr;
    if (this.exceedsMinMax()) {this.reset();}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.img), this.x, this.y);
}

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


//////////////////////////////////////
// Player class. Subclass of Sprite //
//////////////////////////////////////
var Player = function(){
    // the 'box' will be used for collision detection
    this.setBox(34, 122, 34, 17);

    this.img = 'images/char-boy.png';
    this.x = 200;
    this.y = 300;
    this.speed = 120; // measured in pixels per second
    this.score = 0.0;
    this.lives = 3;
};
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    this.handleInput(dt);
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
    this.y = 300;
}

// this method keeps the player from going off the screen
Player.prototype.checkMinMax = function () {
    if (this.x < XMIN) {this.x=XMIN;}
    if (this.x > XMAX) {this.x=XMAX;}

    if (this.y < YMIN) {this.y=YMIN;}
    if (this.y > YMAX) {this.y=YMAX;}
}

///////////////////////////////////////////////////
// Gems that the Player can pickup to get points //
///////////////////////////////////////////////////

// A few more constants for our sprite images
var GEM_G = 'images/gem-green-small.png',
    GEM_B = 'images/gem-blue-small.png',
    GEM_O = 'images/gem-orange-small.png';

var Gem = function(){
    this.setBox(0, 0, 24, 26);
    this.assignRandomGemType();

    // give the new gem a random location
    this.x = this.randomX();
    this.y = this.randomY();
}
Gem.prototype = Object.create(Sprite.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.assignRandomGemType = function(){
    var gemColor = this.randomGemColor();

    if (gemColor === 'green'){
        this.initialize(GEM_G, 50, 3);
    }
    else if (gemColor === 'blue'){
        this.initialize(GEM_B, 25, 4.5);
    }
    else if (gemColor === 'orange'){
        this.initialize(GEM_O, 10, 6);
    }
}

Gem.prototype.randomGemColor = function(){
    var num = randomNumber(1,100);

    // probability: 25% green, 25% blue, 50% orange
    if (num > 75){ return 'green';}
    else if (num > 50){ return 'blue';}
    else { return 'orange'};
}

Gem.prototype.initialize = function(img, pts, lifespan){
    this.img = img;
    this.value = pts;
    this.lifespan = lifespan;
    this.age = 0.0;
}

Gem.prototype.randomX = function(){
    // x min = 0
    // x max = 480
    return randomNumber(0, 480);
}

Gem.prototype.randomY = function(){
    // y min = 50
    // y max = 515
    return randomNumber(50, 515);
}

Gem.prototype.update = function(dt){
    this.age += dt;
}

Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.img), this.x, this.y);
}

Gem.prototype.reset = function(){
    // noop
}

// lets us know when a gem should disappear from the screen
Gem.prototype.expired = function(){
    if (this.age>this.lifespan) {return true;}
    return false;
}

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
// The gemGenerator is used to produce random gems every 2 seconds //
/////////////////////////////////////////////////////////////////////
var gemGenerator = {'time':0.0};
gemGenerator.update = function(dt){
    this.time += dt;
    if (this.time > 1.0){
        this.time = 0.0;
        allGems.push(new Gem());
    }
};

// Stars!
// x,y min =
// x,y max =


// Hearts!
// x,y min =
// x,y max =

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
    if (this.time > 0.1){
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
}


/////////////////////////////////////
// Here we instantiate our objects //
/////////////////////////////////////

var allEntities = [];

var player = new Player();
allEntities.push(player);

for (var i=0; i<5; i++) {
    allEntities.push(new Enemy());
}

var allGems = [];


var waterArea = new Sprite()
waterArea.x = 0;
waterArea.y = 0;
waterArea.width = 505;
waterArea.height = 130;
waterArea.setBox(0,0,505,130);






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
