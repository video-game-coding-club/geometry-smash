var canvas = document.getElementById("game-layer");
var ctx = canvas.getContext("2d");

var x = 0;

var background = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

var draw = function() {
  window.requestAnimationFrame(draw);
  background("cornsilk");

  ctx.fillStyle = "black";
  ctx.fillRect(x, 30, 10, 10);

  x += 1;

  if (x > canvas.width - 10) {
    x = -10;
  }
};

draw();