class GameMenu {

    constructor(startButton, InfiniteButton) {
        // Stocker la référence au bouton HTML
        this.startButton = startButton;
        this.startInfiniteButton = InfiniteButton;
        this.gameState = "MENU";
        
        // Les images ne sont pas chargées ici, mais dans preload()
        // On suppose qu'elles sont stockées dans des variables globales (window.*)
        this.imgPullExpl = window.imgPullExpl;
        this.imgPushExpl = window.imgPushExpl;
        this.imgForcePull = window.imgForcePull;
        this.imgForcePush = window.imgForcePush;
        
        // Attacher l'action au bouton une seule fois
        this.startButton.mousePressed(() => this.startGameNormal());
        this.startInfiniteButton.mousePressed(() => this.startGameInfinite())
        this.updateButtonPosition();
    }

    hideAllButtons()
    {
        this.startButton.hide();    
        this.startInfiniteButton.hide();
    }
    // Fonction pour démarrer la partie et changer l'état
    startGameNormal() {
        this.gameStateNormal();
        this.hideAllButtons();
    }
    startGameInfinite()
    {
        this.gameStateInfinite();
        this.hideAllButtons();
    }
    // Fonction pour revenir au menu
    showMenu() {
        this.gameState = "MENU";
    }

    gameStateNormal()
    {
        this.gameState = "Normal";
    }

    gameStateInfinite()
    {
        this.gameState = "Infinite";
    }
    // Getter pour l'état du jeu, utilisé dans le draw() principal
    getGameState() {
        return this.gameState;
    }

    updateButtonPosition() {
        // Utiliser .elt pour accéder à l'élément DOM et obtenir sa largeur
        const buttonWidth = this.startButton.elt.offsetWidth;
        const buttonWidthInf = this.startInfiniteButton.elt.offsetWidth;
        this.startButton.position(width / 2 - buttonWidth / 2 - 400, height / 2 + 400);
        this.startInfiniteButton.position(width / 2 - buttonWidthInf / 2 +200, height / 2 + 400);
    }

    draw() {
        if (this.gameState !== "MENU") {
            return;
        }

        background(20, 30, 50);
        
        // Mise à jour de la position du bouton et affichage
        this.updateButtonPosition();
        this.startButton.show();
        this.startInfiniteButton.show();
        
        // --- AFFICHAGE DU TEXTE ---
        // Titre
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        text("Le HOOPER", width / 2, height / 2 - 400);
        
        // Instructions
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
- Plus votre curseur est eloignee de la balle, plus l'attraction sera forte (Effet d'elastique)

Gagner des point:
- +10 points multiplier par le streak par annaux

Pénalité :
- Chaque contact avec un mur vous coûte -2 points.

Streak :
- Toucher un Anneaux avec une seul action augmente le streak,
- le streak repart a 1 si vous utiliser une deuxieme action sans toucher l'annaux.
`;
        
        // Texte aligné à gauche (width * 0.001 est très petit, utilisons une marge)
        textAlign(LEFT, CENTER);
        text(instructions, width * 0.05, height / 2); // Marge de 5% à gauche
        
        // --- VÉRIFICATION ET AFFICHAGE DES IMAGES ---
        // Vérifier que toutes les images sont chargées ET ont une width
        if (this.imgPushExpl && this.imgPushExpl.width && 
            this.imgPullExpl && this.imgPullExpl.width &&
            this.imgForcePush && this.imgForcePush.width &&
            this.imgForcePull && this.imgForcePull.width) {
            
            // Calculer les positions des images à droite
            const imgW = 300;
            const imgH = 200;
            const col1X = width - 950;
            const col2X = width - 550;
            const row1Y = height - 800;
            const row2Y = height - 500;
            
            image(this.imgPushExpl, col1X, row1Y, imgW, imgH);
            image(this.imgPullExpl, col2X, row1Y, imgW, imgH);
            image(this.imgForcePush, col1X, row2Y, imgW, imgH);
            image(this.imgForcePull, col2X, row2Y, imgW, imgH);
        } else {
            // Optionnel : afficher un message de chargement
            fill(255, 255, 0);
            textAlign(CENTER);
            textSize(16);
            text("Chargement des images...", width - 700, height - 650);
        }
    }
}
