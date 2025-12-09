class SmallBalls {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.speed = createVector(0, 0);

    // simple physics for the small ball itself (optional)
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = 1;
    this.maxSpeed = 2;
    this.maxForce = 0.1;
  }

  applyForce(f) {
    // F = m * a -> a = F / m
    let a = p5.Vector.div(f, this.mass);
    this.acc.add(a);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  draw() {
    push();
    fill(180);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }

  // Steering: seek behavior (returns a steering force for THIS small ball to move toward target)
  seek(target) {
    // on calcule la direction vers la cible : la vitesse DESIREE
    let desired = p5.Vector.sub(target, this.pos);

    // on limite ce vecteur à la longueur maxSpeed
    desired.setMag(this.maxSpeed);

    // force = desired - current velocity
    let force = p5.Vector.sub(desired, this.vel);
    force.limit(this.maxForce);
    return force;
  }

  // comportement de fuite, inverse de seek
  flee(target) {
    let f = this.seek(target);
    f.mult(-1);
    return f;
  }

  // If the given `ball` is within `range`, apply an attractive force to the ball
  // so the ball is pulled toward this small ball. `strength` is the max force magnitude.
  pullBall(ball, range = 80, strength = 0.5) {
    let dir = p5.Vector.sub(this.pos, ball.pos); // vector pointing from ball -> smallBall
    let d = dir.mag();
    if (d <= 0) return;
    if (d < range) {
      // falloff so nearby triggers stronger pull
      let falloff = constrain(map(d, 0, range, 1, 0), 0, 1);
      dir.normalize();
      dir.mult(strength * falloff);
      // apply to the ball as a force
      ball.applyForce(dir);
    }
  }
}
 