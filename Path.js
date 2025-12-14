class Path {
  constructor() {
    // demi-largeur de la route
    this.radius = 20;
    // tableau de points (p5.Vector)
    this.points = [];
  }

  // Ajout d'un point dans le chemin
  addPoint(x, y) {
    let point = createVector(x, y);
    this.points.push(point);
  }

  // Dessin du chemin
  display() {
    strokeJoin(ROUND);

    // route grise (épaisse)
    stroke(175);
    strokeWeight(this.radius * 2);
    noFill();

    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);

    // ligne centrale noire (fine)
    stroke(0);
    strokeWeight(1);
    noFill();

    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}
