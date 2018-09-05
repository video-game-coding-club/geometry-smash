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

/* The sound effect for the laser obstacle. */
let lightningSound = new Audio("flash.wav");
lightningSound.loop = true;
lightningSound.muted = true;

/* The state of the laser sound. */
let laserSound;

(function() {
  let initialize = function() {
    window.addEventListener('resize', resizeCanvas);
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    resizeCanvas();
  };

  let resizeCanvas = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    floorHeight = canvas.height - 50;
  };

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
    /* The current height of the laser beam. */
    let laserTop = 0;

    if (laserSound === undefined) {
      laserSound = lightningSound.play();
      if (laserSound !== undefined) {
        laserSound.then(_ => {
          console.log("playing sound");
        }).catch(error => {
          console.log("could not play sound");
          console.log(error);
        });
      }
    }
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
  } else {
    if (laserSound !== undefined) {
      lightningSound.pause();
      laserSound = undefined;
    }
  }

  ctx.fillStyle = "black";
  ctx.fillRect(x + 16, 0, 44, 18);
};

var obstaclePole = function(x, y) {
  let speed = 2;
  let height = Math.max(0.5 * canvas.height, y - speed * time);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 100, y);
  ctx.lineTo(x + 80, height);
  ctx.lineTo(x + 20, height);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
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

/* Each obstacle in the level is given by two things:
 *
 * 1. The obstacle type
 * 2. The distance to the previous obstacle
 */
var obstacles = [
  [obstacleSpike, 500],
  [obstaclePole, 200],
  [electricSign, 400],
  [toxicSign, 200],
  [obstacleSpike, 300],
  [obstacleLaser, 200],
  [obstacleSaw, 400],
  [obstacleSpike, 400],
  [obstacleSpike, 550],
  [obstacleSpike, 320],
  [obstacleSpike, 300]
];

var drawObstacles = function() {
  var position = 0;
  var rightside = 20;
  for (var i = 0; i < obstacles.length; i++) {
    position += obstacles[i][1];
    // draw if coordinates are within the canvas
    if (-time + position - rightside > 0 && -time + position < canvas.width) {
      obstacles[i][0](-time + position, floorHeight);
    } else {
      if (obstacles[i][0] === 4) {
        lightningSound.muted = true;
      }
    }
  }
};

let drawSoundButton = function() {
  ctx.fillStyle = "yellow";
  ctx.rect(canvas.width - 230, 10, 220, 100);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.font = '48px serif';
  if (lightningSound.muted) {
    ctx.fillText("Sound On", canvas.width - 220, 80);
  } else {
    ctx.fillText("Sound Off", canvas.width - 220, 80);
  }
};

let mouseClickedSoundButton = function(event) {
  if (event.clientX > canvas.width - 230 && event.clientX < canvas.width - 10 &&
    event.clientY > 10 && event.clientY < 110) {
    if (lightningSound.muted) {
      console.log("turn sound on");
      lightningSound.muted = false;
    } else {
      console.log("turn sound off");
      lightningSound.muted = true;
    }
  }
};

// The "hero" (just a square for now...)
var hero = function(y) {
  let x0 = 20; // distance from right side
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x0 + 60, y);
  ctx.lineTo(x0 + 60, y - 60);
  ctx.lineTo(x0, y - 60);
  ctx.closePath();
  ctx.fillStyle = "yellow";
  ctx.fill();
};

// initial position and velocity
var heroPosition = floorHeight;
var t0 = 0; // jump start time
var vel = 0; // initial velocity
var g = -0.01; // "gravity" acceleration term
var drawHero = function(vel) {
  dt = time - t0; // time (from start of jump)
  vel = vel + g * dt;
  heroPosition = heroPosition - vel * dt;
  if (heroPosition > floorHeight) {
    heroPosition = floorHeight;
  }
  hero(heroPosition);
};

let mouseClickedMoveHero = function(event) {
  vel = 0.6; // jump velocity
  t0 = time; // record the start time of the jump action
};

let mouseClickedListeners = [
  mouseClickedSoundButton,
  mouseClickedMoveHero
];

(function() {
  let initialize = function() {
    canvas.addEventListener('click', mouseClick);
  };

  let mouseClick = function(event) {
    console.log("mouse clicked");
    for (let i = 0; i < mouseClickedListeners.length; i++) {
      mouseClickedListeners[i](event);
    }
  };

  initialize();
})();


var draw = function() {
  window.requestAnimationFrame(draw);
  background("blue");

  drawStats();
  drawSoundButton();
  drawObstacles();
  drawHero(vel);
  drawFloor();
  time++;
};

draw();
