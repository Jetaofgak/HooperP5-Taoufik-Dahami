// CONFIG.js - Configuration centralisée du jeu
const CONFIG = {
  physics: {
    gravity: 0.1,
    airDrag: 0.001,
    explosionForce: 35,
    restitution: 0.6,
    frictionWall: 0.98
  },
  
  ball: {
    radius: 15,
    maxSpeed: 15,
    maxForce: 0.5,
    mass: 1,
    startY: 100,
    maxInputStreak: 2
  },
  
  killBall: {
    maxSpeed: 6,
    maxForce: 0.25,
    slowRadius: 80
  },
  
  path: {
    radius: 20
  },
  
  hoop: {
    radius: 100,
    margin: 100
  },
  
  fearBall: {
    startX: 20,
    startY: 20,
    radius: 70,
    fearRadius: 190
  },
  
  gameManager: {
    normalPulls: 2,
    normalPushes: 3,
    infinitePulls: 3000,
    infinitePushes: 3000,
    gameOverDelay: 5000
  }
};
