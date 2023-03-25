const G = 6.6743e-11; // gravitational constant
const dt = 0.01; // time step

class Body {
constructor(mass, position, velocity) {
this.mass = mass;
this.position = position;
this.velocity = velocity;
this.acceleration = new Vector(0, 0);
}

applyForce(force) {
const acceleration = force.scale(1 / this.mass);
this.acceleration = this.acceleration.add(acceleration);
}

update() {
this.velocity = this.velocity.add(this.acceleration.scale(dt));
this.position = this.position.add(this.velocity.scale(dt));
this.acceleration = new Vector(0, 0);
}
}

class Vector {
constructor(x, y) {
this.x = x;
this.y = y;
}

add(vector) {
return new Vector(this.x + vector.x, this.y + vector.y);
}

scale(scalar) {
return new Vector(this.x * scalar, this.y * scalar);
}

magnitude() {
return Math.sqrt(this.x * this.x + this.y * this.y);
}

normalize() {
const magnitude = this.magnitude();
return new Vector(this.x / magnitude, this.y / magnitude);
}

distanceTo(vector) {
const dx = this.x - vector.x;
const dy = this.y - vector.y;
return Math.sqrt(dx * dx + dy * dy);
}

directionTo(vector) {
const dx = vector.x - this.x;
const dy = vector.y - this.y;
return new Vector(dx, dy).normalize();
}
}

class ThreeStarSystem {
constructor(star1, star2, star3) {
this.star1 = star1;
this.star2 = star2;
this.star3 = star3;
}

simulate() {
// calculate gravitational forces
const force12 = this.calculateForce(this.star1, this.star2);
const force13 = this.calculateForce(this.star1, this.star3);
const force23 = this.calculateForce(this.star2, this.star3);

// apply forces to stars
this.star1.applyForce(force12.add(force13.scale(-1)));
this.star2.applyForce(force12.scale(-1).add(force23));
this.star3.applyForce(force13.add(force23.scale(-1)));

// update star positions and velocities
this.star1.update();
this.star2.update();
this.star3.update();
}

calculateForce(body1, body2) {
const distance = body1.position.distanceTo(body2.position);
const direction = body1.position.directionTo(body2.position);
const magnitude = (G * body1.mass * body2.mass) / (distance * distance);
return direction.scale(magnitude);
}
}

// create 3 stars
const star1 = new Body(1.98e30, new Vector(0, 0), new Vector(0, 0));
const star2 = new Body(1.98e30, new Vector(0, 1.5e11), new Vector(3.0e4, 0));
const star3 = new Body(1.98e30, new Vector(1.5e11, 0), new Vector(0, -3.0e4));

// create 3-star system
const system = new ThreeStarSystem(star1, star1