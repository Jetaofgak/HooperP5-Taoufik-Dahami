class GameMenu {
  constructor(startButton, InfiniteButton) {
    // Références aux boutons HTML
    this.startButton = startButton;
    this.startInfiniteButton = InfiniteButton;
    this.gameState = "MENU";
    
    // Images stockées globalement (chargées dans preload)
    this.imgPullExpl = window.imgPullExpl;
    this.imgPushExpl = window.imgPushExpl;
    this.imgForcePull = window.imgForcePull;
    this.imgForcePush = window.imgForcePush;
    
    // Paramètres de positionnement
    this.buttonOffsetNormal = -400;
    this.buttonOffsetInfinite = 200;
    
    // Paramètres d'affichage des images
    this.imageWidth = 300;
    this.imageHeight = 200;
    
    // Attacher les événements
    this.startButton.mousePressed(() => this.startGameNormal());
    this.startInfiniteButton.mousePressed(() => this.startGameInfinite());
    this.updateButtonPosition();
  }

  // Masquer tous les boutons
  hideAllButtons() {
    this.startButton.hide();
    this.startInfiniteButton.hide();
  }

  // Démarrer le jeu normal
  startGameNormal() {
    this.gameStateNormal();
    this.hideAllButtons();
  }

  // Démarrer le jeu infini
  startGameInfinite() {
    this.gameStateInfinite();
    this.hideAllButtons();
  }

  // Revenir au menu
  showMenu() {
    this.gameState = "MENU";
  }

  // Changer l'état vers Normal
  gameStateNormal() {
    this.gameState = "Normal";
  }

  // Changer l'état vers Infinite
  gameStateInfinite() {
    this.gameState = "Infinite";
  }

  // Getter pour l'état du jeu
  getGameState() {
    return this.gameState;
  }

  // Mise à jour de la position des boutons
  updateButtonPosition() {
    const buttonWidth = this.startButton.elt.offsetWidth;
    const buttonWidthInf = this.startInfiniteButton.elt.offsetWidth;
    
    this.startButton.position(
      width / 2 - buttonWidth / 2 + this.buttonOffsetNormal, 
      height / 2 + 400
    );
    
    this.startInfiniteButton.position(
      width / 2 - buttonWidthInf / 2 + this.buttonOffsetInfinite, 
      height / 2 + 400
    );
  }

  // Affichage du menu
  draw() {
    if (this.gameState !== "MENU") return;
    
    background(20, 30, 50);
    
    // Mise à jour et affichage des boutons
    this.updateButtonPosition();
    this.startButton.show();
    this.startInfiniteButton.show();
    
    // Affichage du texte
    this.drawTitle();
    this.drawInstructions();
    
    // Affichage des images
    this.drawImages();
  }

  // Dessin du titre
  drawTitle() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("Le HOOPER", width / 2, height / 2 - 400);
  }

  // Dessin des instructions
  drawInstructions() {
    textSize(20);
    fill(180, 255, 180);
    
    let instructions = `
Utilisez votre curseur et vos impulsions pour diriger la balle vers le 'Hoop'.

EXPLOSION (PUSH) : Clic Gauche
  - Propulse la balle LOIN du curseur. (Consomme un Push)

ATTRACTION (PULL) : SHIFT + Clic Gauche
  - Attire la balle VERS le curseur. (Consomme un Pull)

Pour le Push, Proximité = Puissance :
  - Plus votre curseur est proche de la balle, plus l'impulsion sera forte.

Pour le Pull, Eloignement = Puissance :
  - Plus votre curseur est éloigné de la balle, plus l'attraction sera forte (Effet d'élastique)

Gagner des points:
  - +10 points multipliés par le streak par anneaux

Pénalité :
  - Chaque contact avec un mur vous coûte -2 points.

Streak :
  - Toucher un Anneau avec une seule action augmente le streak,
  - le streak repart à 1 si vous utilisez une deuxième action sans toucher l'anneau.
`;
    
    textAlign(LEFT, CENTER);
    text(instructions, width * 0.05, height / 2);
  }

  // Dessin des images d'instructions
  drawImages() {
    // Vérifier que toutes les images sont chargées
    if (!this.allImagesLoaded()) {
      this.drawLoadingMessage();
      return;
    }
    
    // Positions des images
    const col1X = width - 950;
    const col2X = width - 550;
    const row1Y = height - 800;
    const row2Y = height - 500;
    
    image(this.imgPushExpl, col1X, row1Y, this.imageWidth, this.imageHeight);
    image(this.imgPullExpl, col2X, row1Y, this.imageWidth, this.imageHeight);
    image(this.imgForcePush, col1X, row2Y, this.imageWidth, this.imageHeight);
    image(this.imgForcePull, col2X, row2Y, this.imageWidth, this.imageHeight);
  }

  // Vérifier que toutes les images sont chargées
  allImagesLoaded() {
    return this.imgPushExpl && this.imgPushExpl.width &&
           this.imgPullExpl && this.imgPullExpl.width &&
           this.imgForcePush && this.imgForcePush.width &&
           this.imgForcePull && this.imgForcePull.width;
  }

  // Message de chargement
  drawLoadingMessage() {
    fill(255, 255, 0);
    textAlign(CENTER);
    textSize(16);
    text("Chargement des images...", width - 700, height - 650);
  }
}
