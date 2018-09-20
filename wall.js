ctx.fillStyle = "rgb(9, 21, 178)";
ctx.fillRect(0, 0, 1000, 1000);

ctx.fillStyle = "rgb(215, 245, 117)";

var y = 0;
var x = 0;

for (let y = 0; y < canvas.height; y += 20) {
  ctx.beginPath();
 ctx.rect(x, y, 10, 10);
ctx.fill();
}

