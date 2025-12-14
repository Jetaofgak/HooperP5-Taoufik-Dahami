class Path {
  constructor() {
    // Rayon arbitraire de 20 (c'est la demi-largeur de la route)
    this.radius = CONFIG.path.radius;
    // Path = tableau de points (vecteurs)
    this.points = [];
  }

  // Ajout d'un point dans le chemin
  addPoint(x, y) {
    let point = createVector(x, y);
    this.points.push(point);
  }

  // Dessin du chemin, devait normallement servir de limite que les kill ball ne peuvent pas depasser.
  display() {
    // Bords arrondis dans les virages
    strokeJoin(ROUND);

    // Couleur de la route = gris
    stroke(175);
    // On dessine le chemin deux fois plus large que la droite qui relie deux points
    strokeWeight(this.radius * 2);
    // Pas de contours
    noFill();

    // Dessin du chemin (large)
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE); // CLOSE signifie : on relie le dernier point au premier

    // Ligne centrale fine, la ligne que les repaire ball suivent a la trace.
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
