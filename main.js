var canvas = document.getElementById("game-layer");
var ctx = canvas.getContext("2d");
var time = 0;
var obstacles = [
  100, 200, 300, 500, 700, 800, 1000, 1300
];

var background = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var spike = function(x, y) {
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
  ctx.fillStyle = "black";
  ctx.translate(0, -100);
  for (var i = 0; i < 10; i++) {
    ctx.rotate(2 * Math.PI / 10);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y);
    ctx.lineTo(x + 5, y - 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
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
    ctx.rect(-time % 400 + 400 * i, 900, 200, 20);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeRect(-time % 400 + 400 * i, 900, 200, 20);
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.rect(-time % 400 + 400 * i + 200, 900, 200, 20);
    ctx.fill();
    ctx.stroke();
  }
};

var drawObstacles = function() {
  for (var i = 0; i < obstacles.length; i++) {
    spike(-time + obstacles[i], 900);
  }
  obstacleSaw(200, 200);
};

var draw = function() {
  window.requestAnimationFrame(draw);
  background("white");

  drawStats();
  drawFloor();
  drawObstacles();
  time++;
};

draw();