class Ball {
  constructor(x, y, r, gravity, s) {
    this.pos = createVector(x, y);
    this.r = r;
    this.gravity = gravity;
    this.posOrg = createVector(x, y);
    this.speed = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = CONFIG.ball.mass;
    this.restitution = CONFIG.physics.restitution;
    this._prevMousePressed = false;
    this.endStrekAfterXInputs = s;
    this.endStreakMaxInputs = s;
    
    // Flags pour les murs
    this.wallLeftTouched = false;
    this.wallRightTouched = false;
    this.ceilingTouched = false;
    this.groundTouched = false;
    
    this.dist = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    this.distMax = constrain(this.dist, 0, 500);
    this.ligneLength = map(this.distMax, 0, 500, 500, 0);
    
    // Paramètres steering
    this.maxSpeed = CONFIG.ball.maxSpeed;
    this.maxForce = CONFIG.ball.maxForce;
    
    // Flag pour éviter reload multiple
    this._reloading = false;
  }

  // === STEERING BEHAVIORS ===
  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    
    force.setMag(desiredSpeed);
    force.sub(this.speed);
    force.limit(this.maxForce);
    return force;
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    return this.seek(target);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  checkAndEvadeFearBalls(fearBalls) {
    for (let fearBall of fearBalls) {
      let d = p5.Vector.dist(this.pos, fearBall.pos);
      if (d < fearBall.fearRadius) {
        let evadeForce = this.evade(fearBall);
        evadeForce.mult(4);
        this.applyForce(evadeForce);
        
        if (fearBall.debug) {
          noFill();
          stroke(255, 0, 0);
          strokeWeight(2);
          circle(fearBall.pos.x, fearBall.pos.y, fearBall.fearRadius * 2);
        }
      }
    }
  }

  // === PHYSICS ===
  updateLineParams() {
    let currentDist = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    const maxEffectDistance = 500;
    const maxLineLength = 500;
    let distContrainte = constrain(currentDist, 0, maxEffectDistance);
    this.ligneLengthPush = map(distContrainte, 0, maxEffectDistance, maxLineLength, 0);
    this.ligneLengthPull = map(distContrainte, 0, maxEffectDistance, 0, maxLineLength);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  applyGravity(g) {
    this.applyForce(createVector(0, this.mass * g));
  }

  applyExplosionImpulse(RatioExplosion, oop) {
    if (oop) return;
    
    gm.reducePush();
    let explosion = p5.Vector.sub(this.pos, createVector(mouseX, mouseY));
    let d = explosion.mag();
    let falloff = constrain(map(d, 0, 500, 1, 0), 0, 1);
    let impulseMag = RatioExplosion * falloff;
    
    if (impulseMag > 0) {
      this.acc.set(0, 0);
      this.speed.set(0, 0);
      explosion.setMag(impulseMag);
      let deltaV = p5.Vector.div(explosion, this.mass);
      this.speed.add(deltaV);
    }
  }

  applyAttractionImpulse(RatioAttraction, oop) {
    if (oop) return;
    
    gm.reducePulls();
    let attraction = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
    let d = attraction.mag();
    let falloff = constrain(map(d, 500, 0, 1, 0), 0, 1);
    let impulseMag = RatioAttraction * falloff;
    
    if (impulseMag > 0) {
      this.acc.set(0, 0);
      this.speed.set(0, 0);
      attraction.setMag(impulseMag);
      let deltaV = p5.Vector.div(attraction, this.mass);
      this.speed.add(deltaV);
    }
  }

  airDrag(k) {
    let v = this.speed.copy();
    let speed = v.mag();
    if (speed === 0) return;
    let dragMag = k * speed * speed;
    v.normalize();
    v.mult(-dragMag);
    this.applyForce(v);
  }

  // === COLLISION AVEC LES MURS (refactorisé) ===
  flagWallSwitcher(side) {
    this.wallLeftTouched = (side === "left");
    this.wallRightTouched = (side === "right");
    this.ceilingTouched = (side === "ceiling");
    this.groundTouched = (side === "ground");
  }

  handleWallCollisions() {
    const friction = CONFIG.physics.frictionWall;
    
    // Mur gauche
    if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.speed.x *= -this.restitution;
      this.speed.y *= friction;
      if (!this.wallLeftTouched) {
        this.flagWallSwitcher("left");
        gm.updateScore(-1);
      }
    } else {
      this.wallLeftTouched = false;
    }
    
    // Mur droit
    if (this.pos.x + this.r > width) {
      this.pos.x = width - this.r;
      this.speed.x *= -this.restitution;
      this.speed.y *= friction;
      if (!this.wallRightTouched) {
        this.flagWallSwitcher("right");
        gm.updateScore(-1);
      }
    } else {
      this.wallRightTouched = false;
    }
    
    // Plafond
    if (this.pos.y - this.r < 0) {
      this.pos.y = this.r;
      this.speed.y *= -this.restitution;
      this.speed.x *= friction;
      if (!this.ceilingTouched) {
        this.flagWallSwitcher("ceiling");
        gm.updateScore(-1);
      }
    } else {
      this.ceilingTouched = false;
    }
    
    // Sol
    let groundY = height;
    if (this.pos.y + this.r > groundY) {
      if (!this.groundTouched) {
        this.flagWallSwitcher("ground");
        gm.updateScore(-1);
      }
      this.pos.y = groundY - this.r;
      if (Math.abs(this.speed.y) < 0.5) {
        this.speed.y = 0;
        this.speed.x *= friction;
      } else {
        this.speed.y *= -this.restitution;
        this.speed.x *= friction;
      }
    } else {
      this.groundTouched = false;
    }
  }

  updatePosition() {
    this.updateLineParams();
    
    // Physique
    let acceleration = p5.Vector.div(this.acc, this.mass);
    this.speed.add(acceleration);
    this.pos.add(this.speed);
    this.acc.set(0, 0);
    
    // Collisions murs
    this.handleWallCollisions();
    
    // UI
    textAlign(LEFT, BOTTOM);
    text("Streak Input Left : " + this.endStrekAfterXInputs, 10, height - 10);
    this.drawTraj();
  }

  // === INPUT ===
  mousePressed(f) {
    let pressed = mouseIsPressed;
    
    if (pressed && !this._prevMousePressed) {
      this.endStrekAfterXInputs -= 1;
      if (this.endStrekAfterXInputs <= 0) {
        this.endStrekAfterXInputs = 0;
        gm.resetStreak();
      }
      
      if (mouseButton === LEFT && keyIsDown(SHIFT)) {
        this.applyAttractionImpulse(f, gm.outOfPulls());
      } else if (mouseButton === LEFT) {
        this.applyExplosionImpulse(f, gm.outOfPush());
      }
    }
    
    this._prevMousePressed = pressed;
  }

  resetStreakInputs() {
    this.endStrekAfterXInputs = this.endStreakMaxInputs;
  }

  drawTraj() {
    let dirToMouse = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
    let currentLineLength;
    let endPointX;
    let endPointY;
    
    strokeWeight(3);
    
    if (keyIsDown(SHIFT)) {
      if (gm.outOfPulls()) {
        console.log("Out of pulls: " + gm.numberOfPulls);
        noStroke();
        return;
      }
      stroke(0, 0, 255, 150);
      currentLineLength = this.ligneLengthPull;
      dirToMouse.setMag(currentLineLength);
      endPointX = this.pos.x + dirToMouse.x;
      endPointY = this.pos.y + dirToMouse.y;
    } else {
      if (gm.outOfPush()) {
        noStroke();
        return;
      }
      stroke(255, 0, 0, 150);
      currentLineLength = this.ligneLengthPush;
      dirToMouse.setMag(currentLineLength);
      endPointX = this.pos.x - dirToMouse.x;
      endPointY = this.pos.y - dirToMouse.y;
    }
    
    line(this.pos.x, this.pos.y, endPointX, endPointY);
    fill(255);
    noStroke();
    ellipse(mouseX, mouseY, 8, 8);
  }

  // === COLLISION KILLBALL (amélioré pour tableau) ===
  isCollidingWithKillBall(killBall) {
    const d = p5.Vector.dist(this.pos, killBall.pos);
    return d <= (this.r + killBall.r);
  }

  checkKillBallCollisions(killBalls) {
    // Accepte maintenant un seul objet OU un tableau
    const kbArray = Array.isArray(killBalls) ? killBalls : [killBalls];
    
    for (const kb of kbArray) {
      if (this.isCollidingWithKillBall(kb)) {
        this.onHitKillBall(kb);
        return;
      }
    }
  }

  onHitKillBall(killBall) {
    if (this._reloading) return;
    this._reloading = true;
    window.location.reload();
  }
}
