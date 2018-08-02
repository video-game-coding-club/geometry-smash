var canvas = document.getElementById("game-layer");
var ctx = canvas.getContext("2d");

/* Reset the game time. */
var time = 0;

/* The position of the floor. */
var floorHeight = 0;

/* The toxic sign image. */
var toxicImage = new Image();
toxicImage.src = "toxic.jpg";

/* The electric sign image. */
var electricImage = new Image();
electricImage.src = "electric.jpg";

/* Each obstacle in the level is given by two numbers:
 *
 * 1. The obstacle type
 * 2. The distance to the previous obstacle
 */
var obstacles = [
  [0, 500],
  [4, 200],
  [0, 100],
  [3, 200],
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
  }

  initialize();
})();

var background = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = '5';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
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

  ctx.fillStyle = "black";
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

var toxicSign = function(x, y) {
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

  ctx.drawImage(electricImage, x - 70, y - 140, 140, 120);
};

var obstacleLaser = function(x, y) {
  ctx.fillStyle = "black";
  ctx.fillRect(x, y, 76, -40);

  ctx.beginPath();
  ctx.arc(x + 38, y - 40, 30, Math.PI, 2 * Math.PI);
  ctx.fillStyle = "gold";
  ctx.fill();

  let laserInterval = 120;
  let laserOn = 40;
  let laserSpeed = 7;

  if (time % laserInterval > laserInterval - laserOn) {
    let laserTop = 0;
    if (time % laserInterval < laserInterval - laserOn + laserSpeed) {
      laserTop = y - 76 - (y - 76) / 10 * (time % 10);
    }
    ctx.beginPath();
    ctx.moveTo(x + 38, y - 76);
    ctx.lineTo(x + 38, laserTop);
    ctx.lineWidth = 9;
    ctx.strokeStyle = "darkred";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 32, y - 75);
    ctx.lineTo(x + 32, laserTop);
    ctx.strokeStyle = "orangered";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 44, y - 75);
    ctx.lineTo(x + 44, laserTop);
    ctx.strokeStyle = "orangered";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  ctx.fillStyle = "black";
  ctx.fillRect(x + 16, 2, 44, 16);
};

var drawFloor = function() {
  let strokeColors = ["black", "black"];
  let fillColors = ["darkblue", "yellow"];

  for (let i = 0; - time % 400 + 400 * i < canvas.width; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.beginPath();
      ctx.rect(-time % 400 + 400 * i + 200 * j, floorHeight, 200, 50);
      ctx.closePath();

      ctx.strokeStyle = strokeColors[j];
      ctx.fillStyle = fillColors[j];
      ctx.fill();
      ctx.stroke();
    }
  }
};

/* The obstacle types. */
var obstacleTypes = [
  obstacleSpike,
  obstacleSaw,
  toxicSign,
  electricSign,
  obstacleLaser
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
  background("blue");

  drawStats();
  drawObstacles();
  drawFloor();
  time++;
};

draw();
