class KillBall{
constructor(x, y, r = 10) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.r = r;

    // réglages physiques
    this.maxSpeed = 6;
    this.maxForce = 0.25;
    this.slowRadius = 80; // rayon d'arrivée (arrive)
  }

  applyForce(f) {
    this.acc.add(f); // modèle accel/vel/pos utilisé dans Nature of Code [web:6]
  }

  // seek + arrive (ralentit en approchant)
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos); // target - position [web:6]
    let d = desired.mag();

    // vitesse désirée: maxSpeed loin, réduite près de la cible (arrive)
    let speed = this.maxSpeed;
    if (d < this.slowRadius) speed = map(d, 0, this.slowRadius, 0, this.maxSpeed);

    desired.setMag(speed); // setMag règle la norme du vecteur [web:45]

    let steer = p5.Vector.sub(desired, this.vel); // desired - velocity [web:6]
    steer.limit(this.maxForce); // limite la force de direction [web:6]
    this.applyForce(steer);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0); // reset accel (physique simple) [web:6]
  }

  display() {
    fill(30, 120, 255);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
  

  }
  
}