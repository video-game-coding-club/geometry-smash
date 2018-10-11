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

var drawStats = function() {
  ctx.fillStyle = "black";
  ctx.font = '48px serif';
  ctx.fillText("time = " + time, 10, 40);
};

var obstacleSpike = {
  draw: function(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 60, y);
    ctx.lineTo(x + 30, y - 60);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
  },
  x: 30,
  y: 100,
  w: 100,
  h: 200
};

var obstacleSaw = {
  draw: function(x, y) {
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
  },
  x: 100,
  y: 100,
  w: 30,
  h: 30
};

var obstacleThorns = {
  draw: function(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y - 10);
    ctx.lineTo(x + 20, y);
    ctx.closePath();
    ctx.stroke();
    this.ymin = y - 10;
  },
  xmin: 20,
  ymin: 0
};

var toxicSign = {
  draw: function(x, y) {
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
    this.ymin = y - 100; // confirm this
  },
  xmin: 20,
  ymin: 0
};

var electricSign = {
  draw: function(x, y) {
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
    this.ymin = y - 100; // confirm this
  },
  xmin: 20,
  ymin: 0
};

var obstacleLaser = {
  draw: function(x, y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 76, -40);

    ctx.beginPath();
    ctx.arc(x + 38, y - 40, 30, Math.PI, 2 * Math.PI);
    ctx.fillStyle = "gold";
    ctx.fill();

    if (time % this.laserInterval > this.laserInterval - this.laserOn) {
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
      if (time % this.laserInterval < this.laserInterval - this.laserOn + this.laserSpeed) {
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
  },
  laserInterval: 120,
  laserOn: 40,
  laserSpeed: 7
};

var obstacleTrapdoor = {
  draw: function(x, y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 350, -80);
    this.ymin = y - 80;
    this.xmin = x; // yes, this is redundant
  },
  xmin: 30,
  ymin: 80
};

var obstaclePole = {
  draw: function(x, y) {
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
  }
};

var explodingWallBricks = [];
var obstacleExplodingWall = {
  draw: function(x, y) {
    if (explodingWallBricks.length === 0) {
      ctx.strokeStyle = "black";
      for (let i = 0; 35 * i < floorHeight; i++) {
        ctx.beginPath();
        ctx.rect(x, 10 + 35 * i, 10, -30);
        ctx.stroke();
      }
    }
  }
};

let drawGameOverSign = function() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.rect(0.5 * canvas.width - 150, 0.5 * canvas.height - 100, 300, 80);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.font = '48px serif';
  ctx.fillText("GAME OVER", 0.5 * canvas.width - 140, 0.5 * canvas.height - 50);
};

var drawBackground = function() {};

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
  [obstacleTrapdoor, 600],
  [obstacleTrapdoor, 600]
];

/*  [obstacleSpike, 500],
  [obstacleThorns, 300],
  [electricSign, 400],
  [toxicSign, 200],
];

/*  [obstacleSpike, 500],
  [obstacleThorns, 300],
  [obstacleExplodingWall, 200],
  [obstaclePole, 200],
  [electricSign, 400],
  [toxicSign, 200],
  [obstacleSpike, 300],
  [obstacleLaser, 200],
  [obstacleSaw, 400],
  [obstacleSpike, 400],
  [obstacleSpike, 550],
  [obstacleSpike, 320],
  [obstacleSpike, 300],
  [obstacleTrapdoor, 600],
  [obstacleSpike, 500],
  [obstacleThorns, 300],
  [obstacleExplodingWall, 200],
  [obstaclePole, 200],
  [electricSign, 400],
  [toxicSign, 200],
  [obstacleSpike, 300],
  [obstacleLaser, 200],
  [obstacleSaw, 400],
  [obstacleSpike, 400],
  [obstacleSpike, 550],
  [obstacleSpike, 320],
  [obstacleSpike, 300],
  [obstacleTrapdoor, 600],
  [obstacleSpike, 500],
  [obstacleThorns, 300],
  [obstacleExplodingWall, 200],
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
];*/

var drawObstacles = function() {
  var obs_speed = 4.0;
  var position = 0;
  var rightside = 20;
  for (var i = 0; i < obstacles.length; i++) {
    position += obstacles[i][1];
    // draw if coordinates are within the canvas
    let obs_xmin = -time * obs_speed + position;
    if (obs_xmin - rightside > 0 && obs_xmin < canvas.width) {
      obstacles[i][0].draw(obs_xmin, floorHeight);
      if (obstacles[i][0].ymin < hero.position && obs_xmin > rightside) {
        drawGameOverSign();
      }
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

var hero = {
  draw: function(y) {

    /*body and color*/

    ctx.fillStyle = "brown";
    ctx.beginPath();
    ctx.ellipse(190, y - 52, 50, 50, 0, 0, 2 * Math.PI);
    ctx.fill();
  },
  position: floorHeight,
  is_jumping: false,
  velocity: 0,
  jump_velocity: 15, // The jump velocity.
  g: -0.3, // "gravity" acceleration term
  xmax: 50,
  ymax: 50
};

var drawHero = function() {
  if (hero.is_jumping) {
    hero.position += hero.velocity;
    hero.velocity -= hero.g;
    if (hero.position > floorHeight) {
      hero.position = floorHeight;
      hero.velocity = 0;
      hero.is_jumping = false;
    }
  }
  hero.draw(hero.position);
  hero.ymax = hero.position;
};

let mouseClickedMoveHero = function(event) {
  if (!hero.is_jumping) {
    hero.velocity = -hero.jump_velocity;
    hero.is_jumping = true;
  }
};

let mouseClickedListeners = [
  mouseClickedSoundButton,
  mouseClickedMoveHero
];

(function() {
  let initialize = function() {
    /* The mousedown event is fired when a pointing device button is
       pressed on an element [1].

       [1] https://developer.mozilla.org/en-US/docs/Web/Events/mousedown
    */
    canvas.addEventListener('mousedown', mouseClick);
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
  drawBackground();
  drawObstacles();
  drawHero();
  drawFloor();

  // NOTE: update this end time with actual level end time or some
  // other event that ends the game
  if (time > 500) {
    drawGameOverSign();
    return;
  }

  time++;
};

draw();
