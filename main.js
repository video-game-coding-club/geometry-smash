var canvas = document.getElementById("game-layer");
var ctx = canvas.getContext("2d");
var time = 0;

var background = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var spike = function(y) {
  ctx.beginPath();
  ctx.moveTo(100, y);
  ctx.lineTo(160, y);
  ctx.lineTo(130, y - 60);
  ctx.closePath();
  ctx.fill();
};

var drawStats = function() {
  ctx.fillStyle = "black";
  ctx.font = '48px serif';
  ctx.fillText("time = " + time, 10, 40);
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

var draw = function() {
  window.requestAnimationFrame(draw);
  background("white");

  drawStats();
  drawFloor();
  time++;
};

draw();