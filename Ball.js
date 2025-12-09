class Ball {
  constructor(x, y, r, gravity) {
    this.pos = createVector(x, y);
    this.r = r;
    this.gravity = gravity;
    this.speed = createVector(0, 0);
    this.acc = createVector(0, 0); // accumulator for forces
    this.mass = 1; // mass of the ball (can be adjusted)
    this.restitution = 0.6; // bounce factor when hitting the ground
    this._prevMousePressed = false; // suivi de l'état du clic pour impulsion unique
    // (slowTime removed)
  }
  applyForce(force) {
    this.acc.add(force);
  }

  applyGravity(g) {
    // Apply gravity as a force: F = m * g (downwards)
    this.applyForce(createVector(0, this.mass * g));
  }

  // slowTime removed

  // Applique une impulsion instantanée (change directement la vitesse)
  applyExplosionImpulse(RatioExplosion) {
    let explosion = p5.Vector.sub(this.pos, createVector(mouseX, mouseY));
    let d = explosion.mag();
    // Treat RatioExplosion as a direct impulse magnitude (multiplier).
    // Apply a falloff with distance (1 at d=0 -> 0 at d=200)
    let falloff = constrain(map(d, 0, 500, 1, 0), 0, 1);
    let impulseMag = RatioExplosion * falloff;
    // n'appliquer l'impulsion que si elle est non-nulle
    if (impulseMag > 0) {
      // annuler l'accumulateur de forces actuel avant d'appliquer l'impulsion
      this.acc.set(0, 0);
      // annuler la vitesse actuelle pour un effet plus net
      this.speed.set(0, 0);
      explosion.setMag(impulseMag);
      // Δv = J / m  (J = impulse)
      let deltaV = p5.Vector.div(explosion, this.mass);
      this.speed.add(deltaV);
    }
  }



  // Applique une impulsion instantanée vers le curseur
  applyAttractionImpulse(RatioAttraction) {
    let attraction = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
    let d = attraction.mag();
    // Treat RatioAttraction as direct impulse magnitude and apply falloff
    let falloff = constrain(map(d, 0, 500, 1, 0), 0, 1);
    let impulseMag = RatioAttraction * falloff;
    if (impulseMag > 0) {
      // annuler l'accumulateur de forces avant l'impulsion
      this.acc.set(0, 0);
      // annuler la vitesse actuelle pour un effet plus net
      this.speed.set(0, 0);
      attraction.setMag(impulseMag);
      let deltaV = p5.Vector.div(attraction, this.mass);
      this.speed.add(deltaV);
    }
  }

  updatePosition() {
    // Intégration basique (dt = 1)
    // acceleration = totalForce / mass
    let acceleration = p5.Vector.div(this.acc, this.mass);
    this.speed.add(acceleration);
    this.pos.add(this.speed);

    // reset force accumulator for next frame
    this.acc.set(0, 0);

    // Collisions avec les 4 murs (gauche/droite/haut/bas)
    // gauche
    if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.speed.x *= -this.restitution;
      // petit amortissement vertical au contact
      this.speed.y *= 0.98;
    }

    // droite
    if (this.pos.x + this.r > width) {
      this.pos.x = width - this.r;
      this.speed.x *= -this.restitution;
      this.speed.y *= 0.98;
    }

    // haut
    if (this.pos.y - this.r < 0) {
      this.pos.y = this.r;
      this.speed.y *= -this.restitution;
      this.speed.x *= 0.98;
    }

    // ground collision handling (empêche la balle de s'enfoncer)
    let groundY = height; // utiliser la hauteur du canvas
    if (this.pos.y + this.r > groundY) {
      // placer la balle sur le sol
      this.pos.y = groundY - this.r;

      // si la vitesse verticale est faible, on immobilise la balle (seuil)
      if (Math.abs(this.speed.y) < 0.5) {
        this.speed.y = 0;
        // appliquer un petit frottement horizontal au repos
        this.speed.x *= 0.98;
      } else {
        // rebond simple
        this.speed.y *= -this.restitution;
        // friction partielle au contact
        this.speed.x *= 0.98;
      }
    }
    
  }
//Appliquer la resistance de l'air quadratique (Genereer par Chatgpt)
  airDrag(k) {
    // Si aucune vitesse : aucun drag
    let v = this.speed.copy();
    let speed = v.mag();
    if (speed === 0) return;

    // Formule quadratique simplifiée:
    // F_drag = -k * |v|^2 * (v / |v|) = -k * |v| * v
    // on regroupe tous les coefficients physiques (0.5 * rho * Cd * A) dans k
    let dragMag = k * speed * speed;
    v.normalize();
    v.mult(-dragMag);
    this.applyForce(v);
  }

  mousePressed(f) {
    // Gérer une impulsion unique au moment du clic (si cette méthode est appelée chaque frame)
    let pressed = mouseIsPressed;
    if (pressed && !this._prevMousePressed) {
      if (mouseButton === LEFT || keyIsDown(65)) {
        this.applyExplosionImpulse(f);
      } 
      if (mouseButton === LEFT && keyIsDown(CONTROL)) {
        this.applyAttractionImpulse(f);
      }
    }
    this._prevMousePressed = pressed;
  }
  
}
    