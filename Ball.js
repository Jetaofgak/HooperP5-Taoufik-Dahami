class Ball {
    constructor(x, y, r, gravity, s) {
        this.pos = createVector(x, y);
        this.r = r;
        this.gravity = gravity;
        this.posOrg = createVector(x, y);
        this.speed = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.mass = 1;
        this.restitution = 0.6;
        this._prevMousePressed = false;
        this.endStrekAfterXInputs = s;
        this.endStreakMaxInputs = s;
        this.wallLeftTouched = false;
        this.wallRightTouched = false;
        this.ceilingTouched = false;
        this.groundTouched = false;
        this.dist = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        this.distMax = constrain(this.dist, 0, 500);
        this.ligneLength = map(this.distMax, 0, 500, 500, 0);
        
        // Paramètres pour evade/pursue/seek
        this.maxSpeed = 15;  // Vitesse max pour les comportements steering
        this.maxForce = 0.5; // Force max pour les comportements steering
    }

    // === NOUVELLES FONCTIONS STEERING ===
    
    /**
     * Seek: Se diriger vers une cible
     * @param {p5.Vector} target - Position cible
     * @param {boolean} arrival - Active le comportement d'arrivée (ralentir près de la cible)
     * @returns {p5.Vector} Force de steering
     */
    seek(target, arrival = false) {
        let force = p5.Vector.sub(target, this.pos);
        let desiredSpeed = this.maxSpeed;
        
        if (arrival) {
            let slowRadius = 100;
            let distance = force.mag();
            if (distance < slowRadius) {
                desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
            }
        }
        
        force.setMag(desiredSpeed);
        force.sub(this.speed);
        force.limit(this.maxForce);
        return force;
    }

    /**
     * Pursue: Poursuivre un véhicule en prédisant sa position future
     * @param {FearBall} vehicle - Le véhicule à poursuivre
     * @returns {p5.Vector} Force de steering
     */
    pursue(vehicle) {
        let target = vehicle.pos.copy();
        let prediction = vehicle.vel.copy();
        prediction.mult(10); // Prédiction 10 frames dans le futur
        target.add(prediction);
        
        // Debug: afficher le point de prédiction (optionnel)
        // fill(0, 255, 0);
        // noStroke();
        // circle(target.x, target.y, 16);
        
        return this.seek(target);
    }

    /**
     * Evade: Fuir un véhicule en prédisant sa position future
     * @param {FearBall} vehicle - Le véhicule à éviter
     * @returns {p5.Vector} Force de steering
     */
    evade(vehicle) {
        let pursuit = this.pursue(vehicle);
        pursuit.mult(-1); // Inverser la direction pour fuir
        return pursuit;
    }

    /**
     * Vérifie si une FearBall est dans le rayon de peur et applique evade
     * @param {Array<FearBall>} fearBalls - Tableau de toutes les FearBalls
     */
    checkAndEvadeFearBalls(fearBalls) {
        for (let fearBall of fearBalls) {
            let d = p5.Vector.dist(this.pos, fearBall.pos);
            
            // Si la balle entre dans le rayon de peur
            if (d < fearBall.fearRadius) {
                let evadeForce = this.evade(fearBall);
                // Amplifier la force pour un évitement plus prononcé
                evadeForce.mult(4);
                this.applyForce(evadeForce);
                
                // Debug: visualiser le rayon de peur actif
                if (fearBall.debug) {
                    noFill();
                    stroke(255, 0, 0);
                    strokeWeight(2);
                    circle(fearBall.pos.x, fearBall.pos.y, fearBall.fearRadius * 2);
                }
            }
        }
    }

    // === FIN NOUVELLES FONCTIONS ===

    updateLineParams() {
        let currentDist = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        const maxEffectDistance = 500;
        const maxLineLength = 500;
        let distContrainte = constrain(currentDist, 0, maxEffectDistance);
        
        this.ligneLengthPush = map(distContrainte, 0, maxEffectDistance, maxLineLength, 0);
        this.ligneLengthPull = map(distContrainte, 0, maxEffectDistance, 0, maxLineLength);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    applyGravity(g) {
        this.applyForce(createVector(0, this.mass * g));
    }

    applyExplosionImpulse(RatioExplosion, oop) {
        if (oop) {
            return;
        }
        
        gm.reducePush();
        let explosion = p5.Vector.sub(this.pos, createVector(mouseX, mouseY));
        let d = explosion.mag();
        let falloff = constrain(map(d, 0, 500, 1, 0), 0, 1);
        let impulseMag = RatioExplosion * falloff;
        
        if (impulseMag > 0) {
            this.acc.set(0, 0);
            this.speed.set(0, 0);
            explosion.setMag(impulseMag);
            let deltaV = p5.Vector.div(explosion, this.mass);
            this.speed.add(deltaV);
        }
    }

    applyAttractionImpulse(RatioAttraction, oop) {
        if (oop) {
            return;
        }
        
        gm.reducePulls();
        let attraction = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
        let d = attraction.mag();
        let falloff = constrain(map(d, 500, 0, 1, 0), 0, 1);
        let impulseMag = RatioAttraction * falloff;
        
        if (impulseMag > 0) {
            this.acc.set(0, 0);
            this.speed.set(0, 0);
            attraction.setMag(impulseMag);
            let deltaV = p5.Vector.div(attraction, this.mass);
            this.speed.add(deltaV);
        }
    }

    flagWallSwitcher(side) {
        if (side === "left") {
            this.wallLeftTouched = true;
            this.wallRightTouched = false;
            this.ceilingTouched = false;
            this.groundTouched = false;
        } else if (side === "right") {
            this.wallRightTouched = true;
            this.wallLeftTouched = false;
            this.ceilingTouched = false;
            this.groundTouched = false;
        } else if (side === "ceiling") {
            this.ceilingTouched = true;
            this.wallLeftTouched = false;
            this.wallRightTouched = false;
            this.groundTouched = false;
        } else if (side === "ground") {
            this.groundTouched = true;
            this.wallLeftTouched = false;
            this.wallRightTouched = false;
            this.ceilingTouched = false;
        }
    }

    updatePosition()
     {
        this.updateLineParams();
        let acceleration = p5.Vector.div(this.acc, this.mass);
        this.speed.add(acceleration);
        this.pos.add(this.speed);
        this.acc.set(0, 0);
        
        // Collisions avec les murs (reste identique)
        if (this.pos.x - this.r < 0) {
            this.pos.x = this.r;
            this.speed.x *= -this.restitution;
            this.speed.y *= 0.98;
            if (!this.wallLeftTouched) {
                this.flagWallSwitcher("left");
                gm.updateScore(-1);
            }
        } else {
            this.wallLeftTouched = false;
        }
        
        if (this.pos.x + this.r > width) {
            this.pos.x = width - this.r;
            this.speed.x *= -this.restitution;
            this.speed.y *= 0.98;
            if (!this.wallRightTouched) {
                this.flagWallSwitcher("right");
                gm.updateScore(-1);
            }
        } else {
            this.wallRightTouched = false;
        }
        
        if (this.pos.y - this.r < 0) {
            this.pos.y = this.r;
            this.speed.y *= -this.restitution;
            this.speed.x *= 0.98;
            if (!this.ceilingTouched) {
                this.flagWallSwitcher("ceiling");
                gm.updateScore(-1);
            }
        } else {
            this.ceilingTouched = false;
        }
        
        let groundY = height;
        if (this.pos.y + this.r > groundY) {
            if (!this.groundTouched) {
                this.flagWallSwitcher("ground");
                gm.updateScore(-1);
            }
            
            this.pos.y = groundY - this.r;
            if (Math.abs(this.speed.y) < 0.5) {
                this.speed.y = 0;
                this.speed.x *= 0.98;
            } else {
                this.speed.y *= -this.restitution;
                this.speed.x *= 0.98;
            }
        } else {
            this.groundTouched = false;
        }
        
        textAlign(LEFT, BOTTOM);
        text("Input left: " + this.endStrekAfterXInputs, 10, height - 10);
        this.drawTraj();
      }

    airDrag(k) {
        let v = this.speed.copy();
        let speed = v.mag();
        if (speed === 0) return;
        
        let dragMag = k * speed * speed;
        v.normalize();
        v.mult(-dragMag);
        this.applyForce(v);
    }

    mousePressed(f) {
        let pressed = mouseIsPressed;
        if (pressed && !this._prevMousePressed) {
            this.endStrekAfterXInputs -= 1;
            if (this.endStrekAfterXInputs <= 0) {
                this.endStrekAfterXInputs = 0;
                gm.resetStreak();
            }
            
            if (mouseButton === LEFT && keyIsDown(SHIFT)) {
                this.applyAttractionImpulse(f, gm.outOfPulls());
            } else if (mouseButton === LEFT) {
                this.applyExplosionImpulse(f, gm.outOfPush());
            }
        }
        this._prevMousePressed = pressed;
    }

    resetStreakInputs() {
        this.endStrekAfterXInputs = this.endStreakMaxInputs;
    }

    drawTraj() {

        
        let dirToMouse = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
        let currentLineLength;
        let endPointX;
        let endPointY;
        strokeWeight(3);
        
        if (keyIsDown(SHIFT)) {
          if(gm.outOfPulls() == true)
          {
            console.log("Out of pulls: "+ gm.numberOfPulls)
            noStroke();
            return;
          }
            stroke(0, 0, 255, 150);
            currentLineLength = this.ligneLengthPull;
            dirToMouse.setMag(currentLineLength);
            endPointX = this.pos.x + dirToMouse.x;
            endPointY = this.pos.y + dirToMouse.y;
        } else {
            if(gm.outOfPush() == true)
          {
            noStroke();
            return;
          }
            stroke(255, 0, 0, 150);
            currentLineLength = this.ligneLengthPush;
            dirToMouse.setMag(currentLineLength);
            endPointX = this.pos.x - dirToMouse.x;
            endPointY = this.pos.y - dirToMouse.y;
        }
        
        line(this.pos.x, this.pos.y, endPointX, endPointY);
        fill(255);
        noStroke();
        ellipse(mouseX, mouseY, 8, 8);
    }
}
