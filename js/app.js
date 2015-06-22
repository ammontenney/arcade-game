/*
TODO: add edge boundaries
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
    XY_INCREMENT = 2;

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

Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 40);

    ctx.fillStyle = 'black';
    ctx.font = '14px Monospace';
    ctx.fillText('x: '+this.x , 5, 19);
    ctx.fillText('y: '+this.y , 5, 33);
};

Player.prototype.handleInput = function(key) {
    if (key === 'left'){this.x-=XY_INCREMENT;}
    else if (key === 'right'){this.x+=XY_INCREMENT;}
    else if (key === 'up'){this.y-=XY_INCREMENT;}
    else if (key === 'down'){this.y+=XY_INCREMENT;}
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
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
