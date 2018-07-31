var canvas = document.getElementById("game-layer");
var ctx = canvas.getContext("2d");

/* Reset the game time. */
var time = 0;

/* The position of the floor. */
var floorHeight = 0;

/* The toxic sign image. */
var toxicImage = new Image();
toxicImage.src = "toxic.jpg";

/* Each obstacle in the level is given by two numbers:
 *
 * 1. The obstacle type
 * 2. The distance to the previous obstacle
 */
var obstacles = [
  [0, 500],
  [2, 200],
  [0, 100],
  [0, 300],
  [1, 400],
  [0, 400],
  [0, 550],
  [0, 320],
  [0, 300]
];

(function() {
  function initialize() {
    window.addEventListener('resize', resizeCanvas, false);
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    floorHeight = canvas.height - 50;

    /* Style the canvas so that coordinate system is not distorted. */
    // canvas.style.width = Math.min(canvas.width, canvas.height);
    // canvas.style.height = Math.min(canvas.width, canvas.height);
  }

  initialize();
})();

var background = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var obstacleSpike = function(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 60, y);
  ctx.lineTo(x + 30, y - 60);
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();
};

var drawStats = function() {
  ctx.fillStyle = "black";
  ctx.font = '48px serif';
  ctx.fillText("time = " + time, 10, 40);
};

var obstacleSaw = function(x, y) {
  var numberSpikes = 20;
  var sawRadius = 80;
  var sawHeight = y - 50 * (3 + Math.sin(time / 70 / 2 * Math.PI));

  ctx.beginPath();
  ctx.ellipse(x, sawHeight, sawRadius, sawRadius, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "silver";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(x, sawHeight, 15, 15, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.beginPath();
  ctx.rect(x - 5, sawHeight, 10, sawHeight);
  ctx.closePath();
  ctx.fill();

  for (var i = 0; i < numberSpikes; i++) {
    ctx.save();

    var alpha = -2 * Math.PI / numberSpikes * i - 0.15 * time / (2 * Math.PI) % (2 * Math.PI);

    ctx.translate(x + sawRadius * Math.sin(alpha), sawHeight + sawRadius * Math.cos(alpha));
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

var electricSign = function(x, y) {
  ctx.beginPath();
  ctx.rect(x - 70, y - 20, 140, -120);
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.rect(x - 10, y, 20, -20);
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.drawImage(toxicImage, x - 70, y - 140, 140, 120);
};

var drawFloor = function() {
  for (var i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.rect(-time % 400 + 400 * i, floorHeight, 200, 50);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "darkblue";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeRect(-time % 400 + 400 * i, floorHeight, 200, 50);
    ctx.closePath();
    ctx.rect(-time % 400 + 400 * i + 200, floorHeight, 200, 50);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();
  }
};

/* The obstacle types. */
var obstacleTypes = [
  obstacleSpike,
  obstacleSaw,
  electricSign
];

var drawObstacles = function() {
  var position = 0;
  for (var i = 0; i < obstacles.length; i++) {
    position += obstacles[i][1];
    obstacleTypes[obstacles[i][0]](-time + position, floorHeight);
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
