class Hoop {
  constructor(x, y, r,a ,n = 0) {
    this.pos = createVector(x, y);
    this.numberOfSmallBalls = n;
    this.r = r;
    this.angle = a; // angle for rotation 
    this.smallBalls = [];
    this._slots = []; // invisible positions forming the hoop (oval)
    this.isCollided = false; // flag anti multiple collision
    this.isRemigrating = false; // flag de remigration
    // oval formation parameters
    this.ovalRatio = 0.2; // ry = r * ovalRatio (controls oval flattening)
    this.slotRadius = 6; // default small ball radius (used when creating)
    this.rx; //Variable declarere pour MoveHoop
    this.ry; //Variable declarere pour MoveHoop
    // instantiate `n` slots around an ellipse and place SmallBalls on them
    let rx = this.r;
    let ry = this.r * this.ovalRatio;
    for (let i = 0; i < n; i++) {
      let theta = (i / n) * TWO_PI;
      // 1) ellipse parametric coords
      let ex = cos(theta) * rx;
      let ey = sin(theta) * ry;

      // 2) rotate them by this.angle
      let rotX = ex * cos(this.angle) - ey * sin(this.angle);
      let rotY = ex * sin(this.angle) + ey * cos(this.angle);

      //Hoop position
      let sx = this.pos.x + rotX;
      let sy = this.pos.y + rotY;
      
      this._slots.push(createVector(sx, sy));
      this.smallBalls.push(new SmallBalls(sx, sy, this.slotRadius));
      this.smallBalls[i].appendHome(this._slots[i].x, this._slots[i].y);
      console.log("Slots",this._slots[i].x, this._slots[i].y);
    }
  }

  // Add a small ball at optional position (defaults to random inside hoop)
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

  // draw only the small balls (do not draw the hoop outline)
  draw() {

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noFill();
    stroke(255, 100);
    ellipse(0, 0, this.r * 2, this.r * this.ovalRatio * 2);
    pop();
    for (let sb of this.smallBalls) {

        sb.draw();
  

      
    }
  }
  drawEllipseOnly() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noFill();
    stroke(255, 100);
    ellipse(0, 0, this.r * 2, this.r * this.ovalRatio * 2);
    pop();
  }

  ellipseTouched() {
    let rx = this.r;
    let ry = this.r * this.ovalRatio;

    let dx = ball.pos.x - this.pos.x;
    let dy = ball.pos.y - this.pos.y;

    let cosA = cos(-this.angle);
    let sinA = sin(-this.angle);

    let lx = dx * cosA - dy * sinA;
    let ly = dx * sinA + dy * cosA;

    //Mesure normaliser de collision
    let val =
      (lx * lx) / ((rx + ball.r) * (rx + ball.r)) +
      (ly * ly) / ((ry + ball.r) * (ry + ball.r));
    if (val <= 1 && !this.isCollided) {
      console.log("touched");
      this.isCollided = true;

    this.splatterSmallBalls();
    }
  }
  splatterSmallBalls() {
    gm.updateScore(10);
    gm.addStreak();
    gm.resetPullsAndPush();
    gm.rese
      for (let sb of this.smallBalls) {
        console.log("flee");
      let fleeForce = sb.flee(ball,10000).mult(1);
      sb.applyForce(fleeForce);
      }
      
    setTimeout(() => {this.MoveHoop(random(100, width - 100), random(100, height - 100));}, 300);
    
  } //TODO SmallBalls s'éparpillent 




remigration() {
    if (!this.isRemigrating) return; 

    let allHome = true;
    for (let sb of this.smallBalls) {
        let distance = p5.Vector.dist(sb.pos, sb.home);
        
        // Si la balle est suffisamment proche (distance > 1 ou va vite)
        if (distance > 1 || sb.vel.mag() > 0.1) { 
            // 1. Calculer la force de retour
            let returnForce = sb.returnHome(); // <-- APPEL DE LA FONCTION CORRIGÉE
            
            // 2. Appliquer la force
            sb.applyForce(returnForce);
            allHome = false; 
        } else {
            // Arrivée
            sb.pos.set(sb.home);
            sb.vel.set(0, 0);
            sb.acc.set(0, 0);
        }
    }
    
    if (allHome) {
        this.isRemigrating = false; 
    }


  // 3. Si toutes les balles sont rentrées, désactiver le flux
  if (allHome) {
    this.isRemigrating = false; 
  }
}
  MoveHoop(x, y) {
    let dx = x - this.pos.x;
    let dy = y - this.pos.y;
    let angle = random(0,radians(90));
    this.pos.set(x, y);
    this.angle = angle;
    // Mettre à jour les positions des slots et des small balls
    this._slots = []; 

    let rx = this.r;
    let ry = this.r * this.ovalRatio; // Utilisez la propriété ovalRatio
    let n = this.smallBalls.length;

   for (let i = 0; i < n; i++) {
 
      let theta = (i / n) * TWO_PI;
      
      // Coordonnées elliptiques
      let ex = cos(theta) * rx;
      let ey = sin(theta) * ry;

      // Rotation
      let rotX = ex * cos(this.angle) - ey * sin(this.angle);
      let rotY = ex * sin(this.angle) + ey * cos(this.angle);

      // Nouvelle position absolue (Hoop.pos + position relative)
      let sx = this.pos.x + rotX;
      let sy = this.pos.y + rotY;

      // Mettre à jour le tableau _slots (bon pour l'état interne)
      this._slots.push(createVector(sx, sy)); 

      // Mise à jour de la position HOME de la SmallBall (ESSENTIEL)
      this.smallBalls[i].appendHome(sx, sy);
    }

    
    this.drawEllipseOnly();
    this.isRemigrating = true;
    this.isCollided = false;
    
  }

}
