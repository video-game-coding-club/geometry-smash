/* Get cavas context. */
let cUI = document.getElementById("ui-layer")
let contextUI = cUI.getContext("2d");
let contextGame = document.getElementById("game-layer").getContext("2d");

var yMax = 325;
var xPos = 200;
var yPos = yMax;
var ySpeed = 0;
var spikes = [0, 1, 6, 10, 20, 26];
var xShift = 400;
var gameState = "play";

mouseClicked = function() {
  ySpeed = -4;
};

var updateYSpeed = function() {
  if (yPos <= yMax) {
    ySpeed += 0.1;
  } else {
    ySpeed = 0;
  }
};

var updateYPos = function() {
  yPos += ySpeed;
  if (yPos > yMax) {
    yPos = yMax;
  }
};

var block = function() {
  fill(55, 0, 255);
  rect(50, yPos, 38, 39);

  fill(68, 255, 0);
  rect(54, yPos + 23, 30, 6);
};

var updateBlock = function() {
  block();
  updateYPos();
  updateYSpeed();
};

var spike = function(x) {
  fill(0, 0, 0);
  triangle(x, yMax + 40, x + 40, yMax + 40, x + 20, yMax);
};

var gameOver = function() {
  gameState = "gameover";
};

var detectCollision = function() {
  if (yPos > 300) {
    for (var i = 0; i < spikes.length; ++i) {
      if (spikes[i] * 50 + xShift < 100) {
        gameOver();
        break;
      }
    }
  }
};

var draw = function() {
  background(221, 255, 0);
  if (gameState === "play") {
    fill(255, 252, 255);
    rect(6, 368, 391, 29);

    updateBlock();

    for (var i = 0; i < spikes.length; i++) {
      spike(spikes[i] * 50 + xShift);
      xShift -= 0.5;
    }

    detectCollision();
  } else if (gameState === "gameover") {
    fill(0, 0, 0);
    rect(86, 143, 240, 56);
    fill(0, 247, 231);
    rect(81, 138, 240, 56);
    fill(0, 0, 0);
    textSize(40);
    text("Game Over!!!", 82, 177);
    fill(34, 0, 255);
    rect(159, 242, 82, 44);
    fill(47, 255, 0);
    textSize(30);
    text("Play", 172, 273);
    fill(255, 0, 0);
    rect(5, 3, 61, 29);
    fill(255, 255, 255);
    textSize(22);
    text("EXIT", 12, 25);
    playSound(getSound("retro/laser2"));

  }
};