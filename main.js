var canvas = document.getElementById("game-layer");
var ctx = canvas.getContext("2d");

/* Reset the game time. */
var time = 0;

/* Each obstacle in the level is given by two numbers:
 *
 * 1. The obstacle type
 * 2. The distance to the previous obstacle
 */
var obstacles = [
  [0, 500],
  [0, 100],
  [0, 300],
  [1, 400],
  [0, 400],
  [0, 550],
  [0, 320],
  [0, 300]
];

var background = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var obstacleSpike = function(x, y) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 60, y);
  ctx.lineTo(x + 30, y - 60);
  ctx.closePath();
  ctx.fill();
};

var drawStats = function() {
  ctx.fillStyle = "black";
  ctx.font = '48px serif';
  ctx.fillText("time = " + time, 10, 40);
};

var sawSpike = function(x, y) {
  var numberSpikes = 20;

  for (var i = 0; i < numberSpikes; i++) {
    ctx.save();

    var alpha = -2 * Math.PI / numberSpikes * i + 0.1 * time / (2 * Math.PI) % (2 * Math.PI);

    ctx.translate(x + 100 * Math.sin(alpha), y + 100 * Math.cos(alpha));
    ctx.rotate(-alpha);

    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 20);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.restore();
  }
};

var obstacleSaw = function(x, y) {
  ctx.beginPath();
  ctx.fillStyle = "silver";
  ctx.ellipse(x, y, 100, 100, 0, 0, 2 * Math.PI);
  ctx.fill();
  sawSpike(x, y);
};

var drawFloor = function() {
  for (var i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.fillStyle = "darkblue";
    ctx.strokeStyle = "black";
    ctx.rect(-time % 400 + 400 * i, 950, 200, 50);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeRect(-time % 400 + 400 * i, 950, 200, 50);
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.rect(-time % 400 + 400 * i + 200, 950, 200, 50);
    ctx.fill();
    ctx.stroke();
  }
};

/* The obstacle types. */
var obstacleTypes = [
  obstacleSpike,
  obstacleSaw
];

var drawObstacles = function() {
  var position = 0;
  for (var i = 0; i < obstacles.length; i++) {
    position += obstacles[i][1];
    obstacleTypes[obstacles[i][0]](-time + position, 950);
  }
};

var draw = function() {
  window.requestAnimationFrame(draw);
  background("white");

  drawStats();
  drawObstacles();
  drawFloor();
  time++;
};

draw();
