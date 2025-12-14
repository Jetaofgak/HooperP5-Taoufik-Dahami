class RepaireBall {
  constructor(path, speedPxPerFrame = 2, r = 8, x = 0, y = 0) {
    this.path = path;
    this.speed = speedPxPerFrame;
    this.r = r;
    
    // Segment courant: A = points[i], B = points[i+1]
    this.i = 0;
    this.t = 0; // Interpolation 0..1
    
    // Position initiale
    this.pos = this.path.points.length > 0
      ? this.path.points[0].copy()
      : createVector(x, y);
  }

  update() {
    const pts = this.path.points;
    if (!pts || pts.length < 2) return;
    
    const a = pts[this.i];
    const b = pts[(this.i + 1) % pts.length];
    
    // Longueur du segment
    const segLen = p5.Vector.dist(a, b);
    if (segLen === 0) {
      this.i = (this.i + 1) % pts.length;
      this.t = 0;
      return;
    }
    
    // Avancer de "speed" pixels le long du segment
    this.t += this.speed / segLen;
    
    // Si on dépasse, passer au segment suivant
    while (this.t >= 1) {
      this.t -= 1;
      this.i = (this.i + 1) % pts.length;
      
      // Recalcul A/B pour continuer correctement
      const a2 = pts[this.i];
      const b2 = pts[(this.i + 1) % pts.length];
      const segLen2 = p5.Vector.dist(a2, b2);
      if (segLen2 === 0) return;
    }
    
    const a3 = pts[this.i];
    const b3 = pts[(this.i + 1) % pts.length];
    
    // Position exacte sur le segment via interpolation
    this.pos = p5.Vector.lerp(a3, b3, this.t);
  }

  // Placer la RepaireBall sur un coin spécifique
  setCorner(cornerIndex) {
    const pts = this.path.points;
    if (!pts || pts.length === 0) return;
    
    this.i = ((cornerIndex % pts.length) + pts.length) % pts.length; // Safe modulo
    this.t = 0;
    this.pos = pts[this.i].copy();
  }

  display() {
    noStroke();
    fill(255, 0, 0);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}
