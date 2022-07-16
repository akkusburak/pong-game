const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const paddleColour = "#fdebd3";
const canvasColour = "#679186";
const ballColour = "##fbd19d";
const textColour = "#fdebd3";
// speed of computer
let computerLevel = 0.08;

const user = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  colour: paddleColour,
  score: 0,
};

const com = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  colour: paddleColour,
  score: 0,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  colour: ballColour,
};

function drawRect(x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r) {
  ctx.fillStyle = ball.colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y) {
  ctx.fillStyle = textColour;
  ctx.font = "40px fantasy";
  ctx.fillText(text, x, y);
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, canvasColour);
  drawRect(user.x, user.y, user.width, user.height, user.colour);
  drawRect(com.x, com.y, com.width, com.height, com.colour);
  drawCircle(ball.x, ball.y, ball.radius);
  drawText(user.score, canvas.width / 3, canvas.height / 7);
  drawText(com.score, (3 * canvas.width) / 5, canvas.height / 7);
}

// control the user paddle;

canvas.addEventListener("mousemove", function movePaddle(evt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;
});

// collision
function collision(b, p) {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return (
    b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
  );
}

// reset round
function resetRound() {
  ball.speed = 5;
  computerLevel = 0.08;
  ball.velocityX = -ball.speed;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}

// update game elements
function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // simple AI to control computer
  com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  let player = ball.x < canvas.width / 2 ? user : com;

  if (collision(ball, player)) {
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed;

    if (ball.speed < 14) {
      ball.speed += 2;
    } else if (ball.speed >= 14) {
      ball.speed = 15;
      computerLevel -= 0.001;
    }

    console.log(ball.speed);
    console.log(computerLevel);
  }

  // update score
  if (ball.x - ball.radius < 0) {
    com.score++;
    resetRound();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetRound();
  }
}

// game init
function game() {
  render();
  update();
}

// loop
setInterval(game, 20);
