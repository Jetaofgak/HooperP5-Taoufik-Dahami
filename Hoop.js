class Hoop {
  constructor(x, y, r, n = 0) {
    this.pos = createVector(x, y);
    this.r = r;
    this.smallBalls = [];
    this._slots = []; // invisible positions forming the hoop (oval)

    // oval formation parameters
    this.ovalRatio = 0.2; // ry = r * ovalRatio (controls oval flattening)
    this.slotRadius = 6; // default small ball radius (used when creating)

    // instantiate `n` slots around an ellipse and place SmallBalls on them
    let rx = this.r;
    let ry = this.r * this.ovalRatio;
    for (let i = 0; i < n; i++) {
      let theta = (i / n) * TWO_PI;
      let sx = this.pos.x + cos(theta) * rx;
      let sy = this.pos.y + sin(theta) * ry;
      this._slots.push(createVector(sx, sy));
      this.smallBalls.push(new SmallBalls(sx, sy, this.slotRadius));
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
    for (let sb of this.smallBalls) {
      if (typeof sb.draw === 'function') {
        sb.draw();
      } else {
        push();
        fill(200);
        noStroke();
        ellipse(sb.pos.x, sb.pos.y, sb.r * 2);
        //Dessine un ovale représentant le cerceau
        


        pop();
      }
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * this.ovalRatio * 1);
      
    }
  }
}

