class Hoop {
  constructor(x, y, r, a, n = 0) {
    this.pos = createVector(x, y);
    this.numberOfSmallBalls = n;
    this.r = r;
    this.angle = a;
    this.smallBalls = [];
    this._slots = [];
    
    // Flags
    this.isCollided = false;
    this.isRemigrating = false;
    
    // Paramètres de l'ellipse
    this.ovalRatio = 0.2; // ry = r * ovalRatio
    this.slotRadius = 6;
    
    // Timer pour la remigration
    this.remigrationDelay = 300; // ms
    
    // Créer les slots et les SmallBalls
    this.initializeSlots(n);
  }

  // Extraction: calcul d'une position de slot sur l'ellipse
  calculateSlotPosition(index, total) {
    let rx = this.r;
    let ry = this.r * this.ovalRatio;
    let theta = (index / total) * TWO_PI;
    
    // Coordonnées elliptiques
    let ex = cos(theta) * rx;
    let ey = sin(theta) * ry;
    
    // Rotation
    let rotX = ex * cos(this.angle) - ey * sin(this.angle);
    let rotY = ex * sin(this.angle) + ey * cos(this.angle);
    
    // Position absolue
    return createVector(this.pos.x + rotX, this.pos.y + rotY);
  }

  // Initialisation des slots et SmallBalls
  initializeSlots(n) {
    for (let i = 0; i < n; i++) {
      let slotPos = this.calculateSlotPosition(i, n);
      
      this._slots.push(slotPos);
      this.smallBalls.push(new SmallBalls(slotPos.x, slotPos.y, this.slotRadius));
      this.smallBalls[i].appendHome(slotPos.x, slotPos.y);
    }
  }

  // Ajouter une SmallBall à une position aléatoire
  addSmallBall(x = null, y = null, r = 6) {
    let bx = x;
    let by = y;
    
    if (bx === null || by === null) {
      let angle = random(0, TWO_PI);
      let dist = random(0, this.r - r);
      bx = this.pos.x + cos(angle) * dist;
      by = this.pos.y + sin(angle) * dist;
    }
    
    this.smallBalls.push(new SmallBalls(bx, by, r));
  }

  // Dessiner le hoop et les SmallBalls
  draw() {
    this.drawEllipseOnly();
    
    for (let sb of this.smallBalls) {
      sb.draw();
    }
  }

  // Dessiner seulement l'ellipse du hoop
  drawEllipseOnly() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noFill();
    stroke(255, 100);
    ellipse(0, 0, this.r * 2, this.r * this.ovalRatio * 2);
    pop();
  }

  // Vérifier collision avec la balle
  ellipseTouched() {
    let rx = this.r;
    let ry = this.r * this.ovalRatio;
    
    // Distance de la balle au centre du hoop
    let dx = ball.pos.x - this.pos.x;
    let dy = ball.pos.y - this.pos.y;
    
    // Rotation inverse pour ramener dans le repère de l'ellipse
    let cosA = cos(-this.angle);
    let sinA = sin(-this.angle);
    let lx = dx * cosA - dy * sinA;
    let ly = dx * sinA + dy * cosA;
    
    // Mesure normalisée de collision (ellipse élargie du rayon de la balle)
    let val = 
      (lx * lx) / ((rx + ball.r) * (rx + ball.r)) +
      (ly * ly) / ((ry + ball.r) * (ry + ball.r));
    
    if (val <= 1 && !this.isCollided) {
      console.log("Hoop touched!");
      this.isCollided = true;
      this.splatterSmallBalls();
    }
  }

  // Éparpiller les SmallBalls quand le hoop est touché
  splatterSmallBalls() {
    // Mise à jour du score et du streak
    gm.updateScore(10);
    gm.addStreak();
    gm.resetPullsAndPush();
    ball.resetStreakInputs();
    
    // Faire fuir toutes les SmallBalls pendant une seul frame pour simuler une explosion.
    for (let sb of this.smallBalls) {
      let fleeForce = sb.flee(ball, 10000);
      sb.applyForce(fleeForce);
    }
    
    // Déplacer le hoop après un délai
    setTimeout(() => {
      this.MoveHoop(
        random(100, width - 100), 
        random(100, height - 100)
      );
    }, this.remigrationDelay);
  }

  //Faire revenir les SmallBalls à leur home dans le nouveau hoop
  remigration() {
    if (!this.isRemigrating) return;
    
    let allHome = true;
    
    for (let sb of this.smallBalls) {
      let distance = p5.Vector.dist(sb.pos, sb.home);
      
      // Si la balle n'est pas encore arrivée
      if (distance > 1 || sb.vel.mag() > 0.1) {
        let returnForce = sb.returnHome();
        sb.applyForce(returnForce);
        allHome = false;
      } else {
        // Arrivée: fixer la position exacte
        sb.pos.set(sb.home);
        sb.vel.set(0, 0);
        sb.acc.set(0, 0);
      }
    }
    
    // Si toutes les balles sont rentrées
    if (allHome) {
      this.isRemigrating = false;
    }
  }

  // Déplacer le hoop à une nouvelle position
  MoveHoop(x, y) {
    // Nouvelle position et angle
    this.pos.set(x, y);
    this.angle = random(0, radians(90));
    
    // Recalculer tous les slots
    this._slots = [];
    let n = this.smallBalls.length;
    
    for (let i = 0; i < n; i++) {
      let slotPos = this.calculateSlotPosition(i, n);
      this._slots.push(slotPos);
      this.smallBalls[i].appendHome(slotPos.x, slotPos.y);
    }
    
    // Activer la remigration
    this.drawEllipseOnly();
    this.isRemigrating = true;
    this.isCollided = false;
  }
}
