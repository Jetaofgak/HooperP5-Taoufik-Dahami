class SmallBalls {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.home = createVector(0, 0); // Position d'attache
    
    // Physique
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = 1;
    
    // Paramètres de mouvement 
    this.maxSpeed = 7;
    this.maxForce = 1;
    this.maxSpeedDispersion = 20;
    this.maxForceDispersion = 2;
    this.maxSpeedReturnHome = 40;
    this.maxForceReturnHome = 100;
    this.slowDownRadius = 100; // Zone de ralentissement pour le retour
    
    // Multiplicateur de fuite
    this.fleeMultiplier = -10;
  }

  // Définir la position "home" (Le point du Hooper appartenant a la SmallBall)
  appendHome(x, y) {
    this.home.set(x, y);
  }

  // Appliquer une force (F = m * a)
  applyForce(f) {
    let a = p5.Vector.div(f, this.mass);
    this.acc.add(a);
  }

  // Mise à jour de la physique
  update() {
    this.vel.add(this.acc);
    // Note: pas de limit ici pour permettre vitesse élevée lors du retour
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  // Dessin de la SmallBall
  draw() {
    this.update();
    push();
    fill(200);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }

  // Retour à la position "home" avec ralentissement (Arrival)
  returnHome() {
    let target = this.home;
    let desiredSpeedValue = this.maxSpeedReturnHome;
    
    // 1. Vecteur désiré (position actuelle → cible)
    let desiredVelocity = p5.Vector.sub(target, this.pos);
    let distance = desiredVelocity.mag();
    
    // 2. Ralentissement progressif dans la zone de freinage
    if (distance < this.slowDownRadius) {
      desiredSpeedValue = map(
        distance,
        0,
        this.slowDownRadius,
        0,
        this.maxSpeedReturnHome
      );
    }
    
    // 3. Définir la magnitude de la vitesse désirée
    desiredVelocity.setMag(desiredSpeedValue);
    
    // 4. Force de steering = vitesse désirée - vitesse actuelle
    let steeringForce = p5.Vector.sub(desiredVelocity, this.vel);
    steeringForce.limit(this.maxForceReturnHome);
    
    return steeringForce;
  }

  // Comportement Seek (aller vers une cible)
  seek(target) {
    let force = p5.Vector.sub(target, this.pos);
    force.setMag(this.maxSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  // Comportement Flee 
  flee(target) {
    // Seek vers la cible, puis inverser
    let seekForce = this.seek(target.pos);
    seekForce.mult(this.fleeMultiplier);
    return seekForce;
  }
}
