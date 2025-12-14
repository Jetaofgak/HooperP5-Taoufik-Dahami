class KillBall {
  constructor(x, y, r = 10) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = r;
    
    // Réglages physiques (depuis CONFIG)
    this.maxSpeed = CONFIG.killBall.maxSpeed;
    this.maxForce = CONFIG.killBall.maxForce;
    this.slowRadius = CONFIG.killBall.slowRadius;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  // Seek + arrive qui regarde les repaireball.
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    
    // Vitesse désirée: maxSpeed loin, réduite près de la cible (arrive)
    let speed = this.maxSpeed;
    if (d < this.slowRadius) {
      speed = map(d, 0, this.slowRadius, 0, this.maxSpeed);
    }
    
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset accel
  }

  display() {
    fill(30, 120, 255);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}
