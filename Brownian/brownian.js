const numParticles = 180;
const dragCoefficient = 0.97;
let particleSize;

let particles = [];
let ball;
let ballRadius;
let bShrimp;

function preload() {
  bShrimp = loadImage("brineShrimp.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  particleSize = windowHeight / 40;
  ballRadius = particleSize * 10;
  for (let i = 0; i < numParticles; i++) {
    let x = random(width);
    let y = random(height);
    particles[i] = new Particle(x, y, particleSize);
  }
  ball = new Particle(width / 2, height / 2, ballRadius);
  
  // Set up buttons
  startPauseButton = select("#startPauseButton");
  startPauseButton.mousePressed(togglePause);

  refreshButton = select("#refreshButton");
  refreshButton.mousePressed(refreshSimulation);
}


function draw() {
  if (!isPaused) {
    background(0);

    ball.update();
    ball.display();

    for (let p of particles) {
      p.update();
      p.display();
    }

    // Check for collisions and separate overlapping particles and ball
    for (let i = 0; i < particles.length; i++) {
      handleCollision(particles[i], ball);

      for (let j = i + 1; j < particles.length; j++) {
        handleCollision(particles[i], particles[j]);
      }
    }
  }
}


function handleCollision(a, b) {
  let d = a.pos.dist(b.pos);
  let minDist = (a.size + b.size) / 2;

  let wrappedPosA = a.pos.copy();
  let wrappedPosB = b.pos.copy();

  if (wrappedPosA.x < minDist) wrappedPosA.x += width;
  if (wrappedPosA.y < minDist) wrappedPosA.y += height;
  if (wrappedPosA.x > width - minDist) wrappedPosA.x -= width;
  if (wrappedPosA.y > height - minDist) wrappedPosA.y -= height;

  if (wrappedPosB.x < minDist) wrappedPosB.x += width;
  if (wrappedPosB.y < minDist) wrappedPosB.y += height;
  if (wrappedPosB.x > width - minDist) wrappedPosB.x -= width;
  if (wrappedPosB.y > height - minDist) wrappedPosB.y -= height;

  let wrappedDist = wrappedPosA.dist(wrappedPosB);

  if (wrappedDist < d) {
    a.pos = wrappedPosA;
    b.pos = wrappedPosB;
    d = wrappedDist;
  }

  if (d < minDist) {
    let overlap = minDist - d;
    let moveVector = a.pos.copy().sub(b.pos).normalize().mult(overlap / 2);
    a.pos.add(moveVector);
    b.pos.sub(moveVector);

    // Update the velocity vectors due to the collision
    let normal = a.pos.copy().sub(b.pos).normalize();
    let relativeVelocity = a.vel.copy().sub(b.vel);
    let impulse = normal.mult(2 * b.mass / (a.mass + b.mass) * relativeVelocity.dot(normal));
    a.vel.sub(impulse);
  }
}

class Particle {
    constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.size = size;
    this.mass = this.size;
    this.vel = createVector(0, 0);
    }

  update() {
    let randomAngle = random(TWO_PI);
    let randomStep = random(1);
    let step = createVector(cos(randomAngle) * randomStep, sin(randomAngle) * randomStep);
    this.vel.add(step);
    this.pos.add(this.vel);

    // Apply drag force
    this.vel.mult(dragCoefficient);

    // Wrap the particles around the borders
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
  }

  display() {
    let useShrimp = select("#shapeSwitch").checked();

    // Helper function to draw the particle
    const drawParticle = (pos) => {
      push();
      translate(pos.x, pos.y);
      if (useShrimp) {
        rotate(this.vel.heading() + PI / 2);
        image(bShrimp, -this.size / 2, -this.size / 2, this.size, this.size);
      } else {
        fill(255);
        ellipse(0, 0, this.size, this.size);
      }
      pop();
    };

    // Draw the particle at its position
    drawParticle(this.pos);

    // Calculate wrapped positions
    let wrappedPositions = [
      createVector(this.pos.x + width, this.pos.y),
      createVector(this.pos.x - width, this.pos.y),
      createVector(this.pos.x, this.pos.y + height),
      createVector(this.pos.x, this.pos.y - height),
      createVector(this.pos.x + width, this.pos.y + height),
      createVector(this.pos.x - width, this.pos.y + height),
      createVector(this.pos.x + width, this.pos.y - height),
      createVector(this.pos.x - width, this.pos.y - height),
    ];

    // Draw remaining parts on the opposite side if crossing a border
    for (let wrappedPos of wrappedPositions) {
      let shouldDraw = false;

      if (wrappedPos.x - this.size / 2 < 0 || wrappedPos.x + this.size / 2 > width) {
        shouldDraw = true;
      }
      if (wrappedPos.y - this.size / 2 < 0 || wrappedPos.y + this.size / 2 > height) {
        shouldDraw = true;
      }

      if (shouldDraw) {
        drawParticle(wrappedPos);
      }
    }
  }
}

// Start/Pause and Refresh buttons
let isPaused = false;
let startPauseButton;
let refreshButton;

function togglePause() {
  isPaused = !isPaused;
  startPauseButton.html(isPaused ? "Start" : "Pause");
}

function refreshSimulation() {
  for (let i = 0; i < numParticles; i++) {
    let x = random(width);
    let y = random(height);
    particles[i] = new Particle(x, y, particleSize);
  }
  ball = new Particle(width / 2, height / 2, ballRadius);
}