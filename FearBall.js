class FearBall 
{
    constructor(x,y,r,fr)
    {
        this.pos = createVector(x, y);
        this.vel = createVector(1, 0);
        this.acc = createVector(0, 0);
        this.r = r;
        this.fearRadius = fr;
        this.maxSpeed = 3;
        this.maxForce = 0.2;
        
        // Paramètres pour le comportement wander
        this.distanceCercle = 100;  // Distance du cercle devant la balle
        this.wanderRadius = 50;     // Rayon du cercle de wander
        this.wanderTheta = PI / 2;  // Angle initial
        this.displaceRange = 0.3;   // Variation de l'angle
        
        // Pour visualiser le debug
        this.debug = false;
    }
    wander()
    {
        let wanderPoint = this.vel.copy();
        wanderPoint.setMag(100);
        wanderPoint.add(this.pos);
        fill(10,10,10);
        circle(wanderPoint.x, wanderPoint.y, this.r)

        let wanderRadius = 50;
        noFill();
        circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2)

        let theta = 0;
        let x = wanderRadius * cos(theta);
        let y = wanderRadius * sin(theta);
        fill(0,255,0);
        noStroke();
        wanderPoint.add(x,y);
        circle(wanderPoint.x , wanderPoint.y, 16);

        let steer = wanderPoint.sub(this.pos);

    }
    wander()
    {
        // Point devant la balle, centre du cercle
        let wanderPoint = this.vel.copy();
        wanderPoint.setMag(this.distanceCercle);
        wanderPoint.add(this.pos);
        
        if (this.debug) {
            // Dessiner le point central (rouge)
            fill(255, 0, 0);
            noStroke();
            circle(wanderPoint.x, wanderPoint.y, 8);
            
            // Dessiner le cercle de wander
            noFill();
            stroke(255);
            circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2);
            
            // Ligne du centre de la balle au point central
            stroke(255);
            line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
        }
        
        // Calculer le point sur le cercle
        // L'angle final = angle de la vélocité + wanderTheta
        let theta = this.wanderTheta + this.vel.heading();
        
        let x = this.wanderRadius * cos(theta);
        let y = this.wanderRadius * sin(theta);
        
        // Ajouter ces coordonnées au point central
        wanderPoint.add(x, y);
        
        if (this.debug) {
            // Dessiner le point cible (vert)
            fill(0, 255, 0);
            noStroke();
            circle(wanderPoint.x, wanderPoint.y, 16);
            
            // Ligne du centre de la balle au point cible
            stroke(0, 255, 0);
            line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
        }
        
        // Calculer la force de steering
        let steer = wanderPoint.sub(this.pos);
        steer.setMag(this.maxForce);
        this.applyForce(steer);
        
        // Déplacer aléatoirement le point sur le cercle
        this.wanderTheta += random(-this.displaceRange, this.displaceRange);
        
        return steer;
    }
    
    applyForce(force)
    {
        this.acc.add(force);
    }
    
    update()
    {
        // Appliquer le comportement wander
        this.wander();
        
        // Mettre à jour la vélocité avec l'accélération
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        
        // Mettre à jour la position avec la vélocité
        this.pos.add(this.vel);
        
        // Réinitialiser l'accélération
        this.acc.set(0, 0);
        
        // Gérer les bords de l'écran
        this.edges();
    }
    
    edges()
    {
        // Téléportation sur les bords (comme Vehicle)
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }
    
    draw()
    {
        // Dessiner la balle
        fill(255, 0, 0);
        noStroke();
        circle(this.pos.x, this.pos.y, this.r * 2);
        
        // Dessiner le rayon de peur (optionnel)
        
        stroke(255, 0, 0, 50);
        noFill();
        circle(this.pos.x, this.pos.y, this.fearRadius * 2);

        // Dessiner la direction (optionnel)
        if (this.debug) {
            stroke(255, 255, 0);
            strokeWeight(2);
            let direction = this.vel.copy();
            direction.setMag(30);
            line(this.pos.x, this.pos.y, 
                 this.pos.x + direction.x, 
                 this.pos.y + direction.y);
        }
    }
}
