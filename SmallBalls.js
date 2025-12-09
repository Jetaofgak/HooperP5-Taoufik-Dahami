class SmallBalls {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.speed = createVector(0, 0);
    this.home = createVector(0,0); // Position ou s'attache la small ball

    // simple physics for the small ball itself (optional)
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = 1;

    this.maxSpeed = 7; // Speed de base
    this.maxForce = 1; // Force de base

    this.maxSpeedDisp = 7;// Speed de dispertion
    this.maxForceDisp =1;// Force de dispertion

    this.MaxSpeedReturnHome = 40; // Speed de retour au cerceau
    this.MaxForceReturnHome = 100; // Force de retour au cerceau


    this.rayonZoneDeFreinage = 100; // Zone de ralentissement pour le retour au cerceau

  }

  appendHome(x, y) {
    this.home.set(x, y);
  }
  applyForce(f) {
    // F = m * a -> a = F / m
    let a = p5.Vector.div(f, this.mass);
    this.acc.add(a);
  }

  update() {
    this.vel.add(this.acc);
    //this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  draw() {
    this.update();
    push();
    fill(200);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }


returnHome() {
    // Utiliser les propriétés du SmallBall
    let target = this.home;
    let desiredSpeedValue = this.MaxSpeedReturnHome;
    
    // 1. Calculer le vecteur désiré (de la position actuelle à la cible)
    let desiredVelocity = p5.Vector.sub(target, this.pos);
    let distance = desiredVelocity.mag(); // Distance à la cible

    // 2. Logique de ralentissement (Arrival)
    // d = 0 est la distance minimale pour le map (arrêt complet)
    if (distance < this.rayonZoneDeFreinage) {
        // Map distance [0 à rayonZoneDeFreinage] vers vitesse [0 à maxSpeed]
        desiredSpeedValue = map(
            distance,
            0, // Démarrage du map à distance 0
            this.rayonZoneDeFreinage,
            0, // Vitesse désirée = 0 à distance 0
            this.MaxSpeedReturnHome // Vitesse désirée = maxSpeed au bord du rayon
        );
    }
    
    // 3. Définir la magnitude de la vitesse désirée
    desiredVelocity.setMag(desiredSpeedValue);
    
    // 4. Calculer la force de steering (ESSENTIEL)
    // Force = Vitesse désirée - Vitesse actuelle
    let steeringForce = p5.Vector.sub(desiredVelocity, this.vel);
    
    // Limiter la force
    steeringForce.limit(this.MaxForceReturnHome);
    
    // 5. Retourner la force calculée
    return steeringForce;
}

  // comportement de seek.
  seek(ball) {


    let force = p5.Vector.sub(ball, this.pos);
    force.setMag(this.maxSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    // on applique la force au véhicule
    return force;
  
  }

  // inverse de seek !
  flee(target, distanceDeDetection = Infinity) {
    return this.seek(target.pos,distanceDeDetection).mult(-10);
  }


}
 