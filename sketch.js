let ball;
let fearBall = [];
let hoop;
let gm;
let executeEnd;
let path;
let repaireBall;
let killBall;
let repaireBall2;
let killBall2;

// Menu
let menuManager;
let startButton;
let startInfiniteButton;

// Images
let imgPullExpl;
let imgPushExpl;
let imgForcePull;
let imgForcePush;

// Sons
let soundEffects = [];

function preload() {
  // Chargement des images
  imgPullExpl = loadImage('images/Pull Explication.png');
  imgPushExpl = loadImage('images/Push Explication.png');
  imgForcePull = loadImage('images/Force Pull.png');
  imgForcePush = loadImage("images/Force Push.png");
  
  // Chargement des sons
  soundEffects[0] = loadSound("sounds/DT_Ok.wav");
  soundEffects[1] = loadSound("sounds/DT_Good.wav");
  soundEffects[2] = loadSound("sounds/DT_Good.wav");
  soundEffects[3] = loadSound("sounds/DT_Great.wav");
  soundEffects[4] = loadSound("sounds/DT_Great.wav");
  soundEffects[5] = loadSound("sounds/DT_Great.wav");
  soundEffects[6] = loadSound("sounds/DT_Excellent.wav");
  soundEffects[7] = loadSound("sounds/dry-bones-death.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Rendre les images globales
  window.imgPullExpl = imgPullExpl;
  window.imgPushExpl = imgPushExpl;
  window.imgForcePull = imgForcePull;
  window.imgForcePush = imgForcePush;
  
  // Initialisation du path
  initPath();
  
  // Initialisation des ennemis
  initEnemies();
  
  // Initialisation des objets du jeu
  initGameObjects();
  
  // Initialisation du menu
  initMenu();
}

//Le path est un rectangle autour de l'ecran
function initPath() {
  path = new Path();
  const m = CONFIG.path.radius;
  path.addPoint(m, m);
  path.addPoint(width - m, m);
  path.addPoint(width - m, height - m);
  path.addPoint(m, height - m);
}


// Instanciation de deux KillBall
function initEnemies() {
  // RepaireBall 1 + KillBall 1
  repaireBall = new RepaireBall(path, 5, 8);
  repaireBall.setCorner(0);
  killBall = new KillBall(100, 100, 30);
  
  // RepaireBall 2 + KillBall 2
  repaireBall2 = new RepaireBall(path, 6, 10, 900, 900);
  repaireBall2.setCorner(2);
  killBall2 = new KillBall(100, 400, 30);
}

//Instantiation des balles, des fearball et du hoop
function initGameObjects() {
  ball = new Ball(
    width / 2, 
    CONFIG.ball.startY, 
    CONFIG.ball.radius, 
    CONFIG.physics.gravity, 
    CONFIG.ball.maxInputStreak
  );
  
  fearBall.push(new FearBall(
    CONFIG.fearBall.startX, 
    CONFIG.fearBall.startY, 
    CONFIG.fearBall.radius, 
    CONFIG.fearBall.fearRadius
  ));
  
  hoop = new Hoop(
    width / 2, 
    height - CONFIG.hoop.margin, 
    CONFIG.hoop.radius, 
    radians(random(0, 90)), 
    30
  );
}

//Pour faire apparaitre le menu
function initMenu() {
  // Bouton du mode normal
  startButton = createButton('Démarrer le Jeu Normal !');
  startButton.size(240, 50);
  startButton.style('font-size', '20px');
  startButton.hide();
  
  // Bouton du mode Infini
  startInfiniteButton = createButton('Démarrer le Jeu Infini!');
  startInfiniteButton.size(240, 50);
  startInfiniteButton.style('font-size', '20px');
  startInfiniteButton.hide();
  
  menuManager = new GameMenu(startButton, startInfiniteButton);
}

function draw() {
  // Vérification du chargement
  if (!imgPushExpl) {
    background(0);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(24);
    text("Chargement du jeu...", width / 2, height / 2);
    console.log("Image non chargée, attente...");
    return;
  }
  
  // Gestion du menu
  menuManager.draw();
  if (menuManager.getGameState() === "MENU") {
    return;
  }
  
  // Initialisation du GameManager selon le mode
  initGameManager();
  
  // Fond
  background(20, 30, 50);
  
  // Dessiner le path et les ennemis
  drawPathAndEnemies();
  
  // Logique du jeu
  updateGameLogic();
  
  // UI
  drawUI();
  
  // Vérification fin de jeu
  checkGameOver();
}

function initGameManager() {
  if (menuManager.getGameState() === "Infinite" && !gm) {
    console.log("Jeu infini");
    gm = new GameManager(
      0, 
      CONFIG.gameManager.infinitePulls, 
      CONFIG.gameManager.infinitePushes
    );
  }
  
  if (menuManager.getGameState() === "Normal" && !gm) {
    console.log("Jeu normal");
    gm = new GameManager(
      0, 
      CONFIG.gameManager.normalPulls, 
      CONFIG.gameManager.normalPushes
    );
  }
}

function drawPathAndEnemies() {
  path.display();
  
  // RepaireBall 1 + KillBall 1
  repaireBall.update();
  repaireBall.display();
  killBall.seek(repaireBall.pos);
  killBall.update();
  killBall.display();
  
  // RepaireBall 2 + KillBall 2
  repaireBall2.update();
  repaireBall2.display();
  killBall2.seek(repaireBall2.pos);
  killBall2.update();
  killBall2.display();
}

function updateGameLogic() {
  // FearBall
  for (let fearBalls of fearBall) {
    fearBalls.update();
    fearBalls.draw();
    fearBalls.wander();
  }
  
  // Ball physics
  ball.checkAndEvadeFearBalls(fearBall);
  ball.applyGravity(CONFIG.physics.gravity);
  ball.mousePressed(CONFIG.physics.explosionForce);
  ball.airDrag(CONFIG.physics.airDrag);
  ball.updatePosition();
  
  // Collision avec KillBalls
  ball.checkKillBallCollisions([killBall, killBall2]);
  
  // Hoop
  hoop.draw();
  hoop.ellipseTouched();
  hoop.remigration();
}

function drawUI() {
  // Score
  gm.displayScore();
  
  // Ball
  fill(255, 0, 0);
  ellipse(ball.pos.x, ball.pos.y, ball.r * 2);
  
  // Message streak au centre
  textAlign(CENTER, CENTER);
  fill(0, 0, 255);
  textSize(20);
  text(gm.okState, width / 2, height / 2);
}

function checkGameOver() {
  if (gm.outOfPulls() && gm.outOfPush()) {
    if (!executeEnd) {
      executeEnd = setTimeout(() => {
        gm = null;
        menuManager.showMenu();
      }, CONFIG.gameManager.gameOverDelay);
    }
  } else {
    if (executeEnd) {
      clearTimeout(executeEnd);
      executeEnd = null;
    }
  }
}
