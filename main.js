var canvas = document.getElementById("game-layer");
var ctx = canvas.getContext("2d");

var x = -10;

var car = new Image();
car.src = "blue-car.jpg";

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

var draw = function() {
  window.requestAnimationFrame(draw);
  background("white");

  ctx.fillStyle = "black";
  ctx.font = '48px serif';
  ctx.fillText("x = " + x, 10, 100);
  ctx.drawImage(car, x, 100, 100, 100);

  x += 1;

  if (x > canvas.width) {
    x = -10;
  }
};

draw();