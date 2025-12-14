class RepaireBall {
  constructor(path, speedPxPerFrame = 2, r = 8,x,y) {
    this.path = path;
    this.speed = speedPxPerFrame;   // vitesse en pixels / frame
    this.r = r;

    // segment courant: A = points[i], B = points[i+1]
    this.i = 0;
    this.t = 0; // 0..1

    // position initiale
    this.pos = this.path.points.length > 0
      ? this.path.points[0].copy()
      : createVector(x, y); // createVector() crée un p5.Vector [web:35]
  }

  update() {
    const pts = this.path.points;
    if (!pts || pts.length < 2) return;

    const a = pts[this.i];
    const b = pts[(this.i + 1) % pts.length];

    // longueur du segment (distance entre 2 vecteurs) [web:34]
    const segLen = p5.Vector.dist(a, b); // [web:34]
    if (segLen === 0) {
      this.i = (this.i + 1) % pts.length;
      this.t = 0;
      return;
    }

    // avancer de "speed" pixels le long du segment
    this.t += this.speed / segLen;

    // si on dépasse, passer au segment suivant (gestion du "reste")
    while (this.t >= 1) {
      this.t -= 1;
      this.i = (this.i + 1) % pts.length;

      // recalcul A/B pour continuer correctement
      const a2 = pts[this.i];
      const b2 = pts[(this.i + 1) % pts.length];
      const segLen2 = p5.Vector.dist(a2, b2); // [web:34]
      if (segLen2 === 0) return;
      // on continue la boucle while si t reste >= 1
    }

    const a3 = pts[this.i];
    const b3 = pts[(this.i + 1) % pts.length];

    // position exacte sur le segment via interpolation [web:21]
    this.pos = p5.Vector.lerp(a3, b3, this.t); // [web:21]
  }
  setCorner(cornerIndex) {
  const pts = this.path.points;
  if (!pts || pts.length === 0) return;

  this.i = ((cornerIndex % pts.length) + pts.length) % pts.length; // safe modulo [web:62]
  this.t = 0;
  this.pos = pts[this.i].copy();
}
  display() {
    noStroke();
    fill(255, 0, 0);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}
