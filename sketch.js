let ball;
let fearBall= [] ;
let hoop;
let gm;
let executeEnd;

// Remplacer gameState et startGame par l'instance de la classe
let menuManager; 
let startButton;
let startInfiniteButton;

// Déclarer les variables d'images pour que preload puisse les utiliser
let imgPullExpl; 
let imgPushExpl;
let imgForcePull;
let imgForcePush;

function preload() {
    // Le chargement des images reste dans preload car il doit être synchrone
    imgPullExpl = loadImage('images/Pull Explication.png'); 
    imgPushExpl = loadImage('images/Push Explication.png');
    imgForcePull = loadImage('images/Force Pull.png');
    imgForcePush = loadImage("images/Force Push.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    window.imgPullExpl = imgPullExpl;
    window.imgPushExpl = imgPushExpl;
    window.imgForcePull = imgForcePull;
    window.imgForcePush = imgForcePush;
    
    
    // Initialisation des objets du jeu
    ball = new Ball(width / 2, 100, 15, 0.1, 2);
    fearBall.push(new FearBall(20, 20,70, 190));
    hoop = new Hoop(width / 2, height - 100, 100, radians(random(0, 90)), 30);
    
    // Création du bouton
    startButton = createButton('Démarrer le Jeu Normal !');
    startButton.size(240, 50);
    startButton.style('font-size', '20px');
    startButton.hide(); 

    startInfiniteButton = createButton('Démarrer le Jeu Infini!');
    startInfiniteButton.size(240, 50);
    startInfiniteButton.style('font-size', '20px');
    startInfiniteButton.hide(); 
    // Initialisation du gestionnaire de menu
    menuManager = new GameMenu(startButton,startInfiniteButton);
    
    // Réinitialisation de la balle au démarrage via une fonction helper pour l'uniformité

}

// Fonction utilitaire pour réinitialiser le jeu (appelée par setup et si besoin)


function draw() {

  //Verification des images
    if (imgPushExpl == null) {
        background(0);
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(24);
        text("Chargement du jeu...", width / 2, height / 2);
        console.log("Image non chargée, attente...");
        return; // Stopper l'exécution jusqu'au chargement
    }

    // --- MACHINE À ÉTATS ---
    // Maintenant on peut appeler menuManager en toute sécurité
    menuManager.draw();
    
    if (menuManager.getGameState() === "MENU") {
        return;
    }
    if (menuManager.getGameState() === "Infinite" && !gm)
    {
      console.log("Jeu infini")
      gm = new GameManager(0, 3000, 3000);
    }

    if (menuManager.getGameState() === "Normal" && !gm)
    {
      console.log("Jeu normal")
      gm = new GameManager(0,2,3);
    }
    // --- Logique du jeu ---
    background(20, 30, 50);
    // --- FIN MACHINE À ÉTATS ---

    // Logique du jeu (seulement si gameState === "PLAYING")
    
    for (let fearBalls of fearBall) {
        fearBalls.update();
        fearBalls.draw();
        fearBalls.wander();
    }
    ball.checkAndEvadeFearBalls(fearBall);
    gm.displayScore();
    hoop.draw();
    hoop.ellipseTouched();
    // Dessiner la fearBall
    // Dessiner la balle 
    
    ellipse(ball.pos.x, ball.pos.y, ball.r * 2);
    fill(255, 0, 0);

    ball.applyGravity(0.1);
    ball.mousePressed(35);
    ball.airDrag(0.001);
    ball.updatePosition();


    hoop.remigration();

    // Logique de fin de jeu
    if (gm.outOfPulls() && gm.outOfPush()) {
        if (!executeEnd) {
            executeEnd = setTimeout(() => {
                // Réinitialiser l'état du jeu
                gm = null;
                menuManager.showMenu();      // Retourner au menu
            }, 5000);
        }
    } else {
        if (executeEnd) {
            clearTimeout(executeEnd);
            executeEnd = null;
        }
    }
    function keyPressed() {
    if (key === 'd') {
        fearBall.debug = !fearBall.debug;
    }
}

}