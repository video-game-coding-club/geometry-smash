let canvas = document.getElementById("game-layer");
let ctx = canvas.getContext("2d");

/* Reset the game time. */
let time = 0;

/* The position of the floor. */
let floorHeight = 0;

/* Debug mode. */
let debugMode = false;

/* The current mouse position. */
let mousePosition = {
  x: 0,
  y: 0
};

/* The toxic sign image. */
let toxicImage = new Image();
toxicImage.src = "toxic.jpg";

/* The electric sign image. */
let electricImage = new Image();
electricImage.src = "electric.jpg";

/* The sound effect for the laser obstacle. */
let lightningSound = new Audio("flash.wav");
lightningSound.loop = true;
lightningSound.muted = true;

/* The state of the laser sound. */
let laserSound;

class GameObject {
  constructor(w = 0, h = 0) {
    this.x = 0;
    this.y = 0;
    this.w = w;
    this.h = h;
  }

  /* This method needs to be defined by each game object class. */
  draw() {}

  drawBoundingBox() {
    ctx.strokeStyle = "orangered";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.font = '14px monospace';
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("(x, y)", this.x, this.y);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("(x + w, y)", this.x + this.w, this.y);
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("(x + w, y + h)", this.x + this.w, this.y + this.h);
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("(x, y + h)", this.x, this.y + this.h);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }
}

class ObstacleSpike extends GameObject {
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 60, this.y);
    ctx.lineTo(this.x + 30, this.y - 60);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
  }
}
let obstacleSpike = new ObstacleSpike(60, -60);

let obstacleSaw = {
  draw: function(x, y) {
    let numberSpikes = 20;
    let sawRadius = 80;
    let sawHeight = y - 50 * (3 + Math.sin(time / 70 / 2 * Math.PI));
    // there are two variables called 'y', which may be confusing ...
    this.y = 80 - 50 * (3 + Math.sin(time / 70 / 2 * Math.PI));

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

    for (let i = 0; i < numberSpikes; i++) {
      ctx.save();

      let alpha = -2 * Math.PI / numberSpikes * i - 0.15 * time / (2 * Math.PI) % (2 * Math.PI);

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
  x: -80,
  y: 0,
  w: 160,
  h: -160
};

let obstacleThorns = {
  draw: function(x, y) {
    this.x = x;
    this.y = y;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 10, this.y - 10);
    ctx.lineTo(this.x + 20, this.y);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
  },
  x: 0,
  y: 0,
  w: 20,
  h: -10,
  pos_x: 0,
  pos_y: 0
};

let toxicSign = {
  draw: function(x, y) {
    // aligned so x,y as bottom left
    ctx.beginPath();
    ctx.rect(x, y - 20, 140, -120);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.rect(x + 60, y, 20, -20);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.drawImage(toxicImage, x, y - 140, 140, 120);
  },
  x: 0,
  y: 0,
  w: 140,
  h: -140
};

let electricSign = {
  draw: function(x, y) {
    // aligned so x,y as bottom left
    ctx.beginPath();
    ctx.rect(x, y - 20, 140, -120);
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.rect(x + 60, y, 20, -20);
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.fill();

    ctx.drawImage(electricImage, x, y - 140, 140, 120);
  },
  x: 0,
  y: 0,
  w: 140,
  h: -140
};

let obstacleLaser = {
  draw: function(x, y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 76, -40);

    ctx.beginPath();
    ctx.arc(x + 38, y - 40, 30, Math.PI, 2 * Math.PI);
    ctx.fillStyle = "gold";
    ctx.fill();

    if (time % this.laserInterval > this.laserInterval - this.laserOn) {
      this.h = -canvas.height;
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
      this.h = 0;
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
  laserSpeed: 7,
  x: 0,
  y: 0,
  w: 76,
  h: 0
};

let obstacleTrapdoor = {
  draw: function(x, y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 350, -80);
  },
  x: 0,
  y: 0,
  w: 350,
  h: -80
};

let obstaclePole = {
  draw: function(x, y) {
    let speed = 0.1;
    //let height = -Math.max(300, x - speed * time);
    let poleHeight = Math.min(250, 0.5 * canvas.width - x);
    this.h = -poleHeight;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 100, y);
    ctx.lineTo(x + 80, floorHeight - poleHeight);
    ctx.lineTo(x + 20, floorHeight - poleHeight);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();
  },
  x: 0,
  y: 0,
  w: 100,
  h: -100
};

let explodingWallBricks = [];
let obstacleExplodingWall = {
  draw: function(x, y) {
    if (explodingWallBricks.length === 0) {
      ctx.strokeStyle = "black";
      for (let i = 0; 35 * i < floorHeight; i++) {
        ctx.beginPath();
        ctx.rect(x, 10 + 35 * i, 10, -30);
        ctx.stroke();
      }
    }
  },
  x: 0,
  y: 0,
  w: 10,
  h: -canvas.height
};

/* Each obstacle in the level is given by two things:
 *
 * 1. The obstacle type
 * 2. The distance to the previous obstacle
 */
let obstacles = [
  [obstacleTrapdoor, 600],
  [obstacleSpike, 500],
  [obstacleSaw, 400],
  [electricSign, 400],
  [obstacleLaser, 500],
  [obstacleThorns, 300],
  [obstaclePole, 500],
  [toxicSign, 300],
  [obstacleSpike, 500],
  [obstacleThorns, 300],
  [obstacleExplodingWall, 200],
  [electricSign, 400],
  [toxicSign, 200],
  [obstacleSpike, 300],
  [obstacleLaser, 200],
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
];

let background = function(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = '5';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
};

let drawStats = function() {
  ctx.fillStyle = "white";
  ctx.font = '20px monospace';
  ctx.fillText("time           = " + time, 10, 20);
  ctx.fillText("hero position  = [" + hero.x.toFixed(0) +
    ", " + hero.y.toFixed(0) + "]", 10, 40);
  ctx.fillText("hero velocity  = " + hero.velocity.toFixed(2), 10, 60);
  ctx.fillText("booster (CTRL) = " + (hero.is_boosting ? "on" : "off"), 10, 80);
  ctx.fillText("debug (d)      = " + (debugMode ? "on" : "off"), 10, 100);
  ctx.fillText("restart (r)", 10, 120);
  if (debugMode) {
    ctx.fillText("step debug (s) = " + (debugMode ? "enabled" : "disabled"), 10, 140);
    ctx.fillText("step back (S)  = " + (debugMode ? "enabled" : "disabled"), 10, 160);
  }
};

let drawGameOverSign = function() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.rect(0.5 * canvas.width - 150, 0.5 * canvas.height - 100, 300, 60);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = '48px serif';
  ctx.fillText("GAME OVER", 0.5 * canvas.width - 140, 0.5 * canvas.height - 55);
};

let drawBackground = function() {};

let drawFloor = function() {
  let strokeColors = ["black", "black"];
  let fillColors = ["darkblue", "yellow"];

  let floorSpeed = 1;

  for (let i = 0; - floorSpeed * time % 400 + 400 * i < canvas.width; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.beginPath();
      ctx.rect(-floorSpeed * time % 400 + 400 * i + 200 * j, floorHeight, 200, 50);
      ctx.closePath();

      ctx.strokeStyle = strokeColors[j];
      ctx.fillStyle = fillColors[j];
      ctx.fill();
      ctx.stroke();
    }
  }
};

let drawBoundingBox = function(obstacle) {
  ctx.strokeStyle = "orangered";
  ctx.lineWidth = 1;
  ctx.strokeRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);

  ctx.font = '14px monospace';
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("(x, y)", obstacle.x, obstacle.y);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("(x + w, y)", obstacle.x + obstacle.w, obstacle.y);
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("(x + w, y + h)", obstacle.x + obstacle.w, obstacle.y + obstacle.h);
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("(x, y + h)", obstacle.x, obstacle.y + obstacle.h);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
};

let drawObstacles = function() {
  let obs_speed = 1;
  let obs_listPosition = 0;
  let rightside = 20;

  for (let i = 0; i < obstacles.length; i++) {
    // x-position summed from list
    obs_listPosition += obstacles[i][1];

    // draw if coordinates are within the canvas
    let obs_x = -time * obs_speed + obs_listPosition;
    let obs_y = floorHeight;
    if (obs_x - rightside > 0 && obs_x < canvas.width) {
      let obs_left = obs_x + obstacles[i][0].x;
      let obs_top = obs_y + obstacles[i][0].h;

      obstacles[i][0].x = obs_x;
      obstacles[i][0].y = obs_y;

      obstacles[i][0].draw(obs_x, obs_y);

      if (debugMode) {
        if (obstacles[i][0].hasOwnProperty("drawBoundingBox")) {
          obstacles[i][0].drawBoundingBox();
        } else {
          drawBoundingBox(obstacles[i][0]);
        }
      }

      /* Detect collision.
       *
       * (1) How does this work?
       * (2) Does it always work?
       */
      if (hero.x + hero.w > obstacles[i][0].x &&
        hero.y > obstacles[i][0].y + obstacles[i][0].h &&
        hero.x < obstacles[i][0].x + obstacles[i][0].w &&
        hero.y + hero.h < obstacles[i][0].y) {
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
  ctx.fillRect(canvas.width - 230, 10, 220, 100);

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

let drawHeroBoundingBox = function(object) {
  ctx.strokeStyle = "lightblue";
  ctx.lineWidth = "1";
  ctx.strokeRect(object.x, object.y, object.w, object.h);

  ctx.font = '14px monospace';
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("(x, y)", object.x, object.y);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("(x + w, y)", object.x + object.w, object.y);
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("(x + w, y + h)", object.x + object.w, object.y + object.h);
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("(x, y + h)", object.x, object.y + object.h);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
};

let hero = {
  draw: function() {

    /* body and color */

    ctx.beginPath();
    ctx.ellipse(this.x + 50, this.y - 50, 50, 50, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = "rgb(105, 73, 75)";
    ctx.fill();

    /* big smile */

    ctx.fillStyle = "rgb(245, 240, 240)";
    ctx.beginPath();
    ctx.arc(this.x + 50, this.y - 50, 35, 0, Math.PI);
    ctx.closePath();
    ctx.fill();

    /* eyes and pupils */

    ctx.beginPath();
    ctx.ellipse(this.x + 30, this.y - 70, 12, 12, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(this.x + 70, this.y - 70, 12, 12, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.ellipse(this.x + 30, this.y - 66, 6, 6, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(this.x + 70, this.y - 66, 6, 6, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    /* arms and fists */

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 60);
    ctx.lineTo(this.x - 20, this.y - 90);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x + 100, this.y - 60);
    ctx.lineTo(this.x + 120, this.y - 90);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.ellipse(this.x - 20, this.y - 90, 10, 10, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(this.x + 120, this.y - 90, 10, 10, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  },
  is_jumping: false,
  is_boosting: false,
  velocity: 0,
  jump_velocity: 15, // The jump velocity.
  g: -0.3, // "gravity" acceleration term
  x: 190 - 50,
  y: floorHeight,
  w: 100,
  h: -100
};

let drawHero = function() {
  if (debugMode) {
    hero.x = mousePosition.x;
    hero.y = mousePosition.y;
  } else {
    if (hero.is_boosting) {
      hero.velocity -= 0.5;
      hero.is_jumping = true;
    }

    hero.velocity -= hero.g;
    hero.y += hero.velocity;

    if (hero.y > floorHeight) {
      hero.y = floorHeight;
      hero.velocity = 0;
      hero.is_jumping = false;
    }
  }
  hero.draw();
  if (debugMode) {
    drawHeroBoundingBox(hero);
  }
};

let jumpHero = function() {
  if (!debugMode) {
    if (!hero.is_jumping) {
      console.log("jump hero");
      hero.velocity = -hero.jump_velocity;
      hero.is_jumping = true;
    }
  }
};

let mouseClickedMoveHero = function(event) {
  jumpHero();
};

let mouseMoved = function(event) {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
};

let powerkeyPressedMoveHero = function(event) {
  if (event.code === "ControlLeft" || event.code == "ControlRight") {
    console.log("boosting hero");
    hero.is_boosting = true;
  }
};

let debugKeyPressed = function(event) {
  if (event.code === "KeyD" && event.key === "d") {
    if (debugMode) {
      /* Reset x component of hero position. */
      hero.x = 190 - 50;
      hero.velocity = 0;
    }
    debugMode = !debugMode;
  }
};

let restartKeyPressed = function(event) {
  if (event.code === "KeyR" && event.key === "r") {
    time = 0;
  }
};

let stepKeyPressed = function(event) {
  if (event.code === "KeyS" && event.key === "s") {
    if (debugMode) {
      time++;
    }
  }
};

let reverseStepKeyPressed = function(event) {
  if (event.code === "KeyS" && event.key === "S") {
    if (debugMode) {
      time--;
    }
  }
};

let powerkeyReleasedMoveHero = function(event) {
  if (event.code === "ControlLeft" || event.code == "ControlRight") {
    console.log("turning hero booster off");
    hero.is_boosting = false;
  }
};

let spaceKeyPressed = function(event) {
  if (event.code === "Space" && event.key === " ") {
    jumpHero();
  }
};

let mouseClickedListeners = [
  mouseClickedSoundButton,
  jumpHero
];

let mouseMoveListeners = [
  mouseMoved
];

let keyPressListeners = [
  powerkeyPressedMoveHero,
  debugKeyPressed,
  restartKeyPressed,
  spaceKeyPressed,
  stepKeyPressed,
  reverseStepKeyPressed
];

let keyReleaseListeners = [
  powerkeyReleasedMoveHero
];

(function() {
  let mouseClick = function(event) {
    console.log("mouse clicked");
    for (let i = 0; i < mouseClickedListeners.length; i++) {
      mouseClickedListeners[i](event);
    }
  };

  let mouseMove = function(event) {
    console.log("mouse moved");
    for (let i = 0; i < mouseMoveListeners.length; i++) {
      mouseMoveListeners[i](event);
    }
  };

  let keyPress = function(event) {
    console.log("pressed key '" + event.key + "', code " + event.code);
    for (let i = 0; i < keyPressListeners.length; i++) {
      keyPressListeners[i](event);
    }
  };

  let keyRelease = function(event) {
    console.log("released key '" + event.key + "', code " + event.code);
    for (let i = 0; i < keyReleaseListeners.length; i++) {
      keyReleaseListeners[i](event);
    }
  };

  let initialize = function() {
    /* The mousedown event is fired when a pointing device button is
       pressed on an element [1].

       [1] https://developer.mozilla.org/en-US/docs/Web/Events/mousedown
    */
    canvas.addEventListener('mousedown', mouseClick);
    canvas.addEventListener('touchstart', mouseClick);
    canvas.addEventListener('mousemove', mouseMove);
    document.addEventListener('keydown', keyPress);
    document.addEventListener('keyup', keyRelease);
  };

  initialize();
})();

let draw = function() {
  window.requestAnimationFrame(draw);
  background("blue");

  drawStats();
  drawSoundButton();
  drawBackground();
  drawFloor();
  drawObstacles();
  drawHero();
  //drawFloor();

  if (!debugMode) {
    time++;
  }
};

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

draw();
