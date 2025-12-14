# Le HOOPER 

## Description
**Le HOOPER** est un jeu d'adresse développé en p5.js où vous devez guider une balle vers des anneaux (hoops) en utilisant des forces de push et pull, tout en évitant des obstacles mobiles.

##  Contrôles

### Système d'impulsions
- **PUSH** : `Clic gauche`
  - Propulse la balle **LOIN** du curseur
  - Plus le curseur est **proche** de la balle, plus l'impulsion est forte
  - Consomme 1 Push

- **PULL** : `SHIFT + Clic gauche`
  - Attire la balle **VERS** le curseur
  - Plus le curseur est **éloigné** de la balle, plus l'attraction est forte (effet élastique)
  - Consomme 1 Pull

##  Steering Behaviors Implémentés

### 1. **Evade** (Fuite)
- **FearBall** (grosse balle rouge) : Patrouille aléatoirement sur l'écran
- Possède un **rayon de peur** (zone rouge translucide)
- Quand votre balle entre dans ce rayon, elle **fuit automatiquement** la FearBall
- La force d'évitement est amplifiée (×4) pour une esquive prononcée
- **SmallBalls** (Les petite boules blanche du hoop) : S'éloigne lorseque la Ball touche le cerceau.
- Elle subissent le Evade une seul fois pour simuler une explosion, en fonction de la ou la balle frappe le hoop les SmallBalls reagissent de facon adequate.

### 2. **Path Following** (Suivi de chemin)
- **RepaireBall** (balles rouges sur le chemin) : Suivent un path rectangulaire autour de l'écran
- Se déplacent à vitesse constante le long des bords
- Positionnées aux coins du rectangle (coin 0 et coin 2)

### 3. **Seek + Arrive** (Poursuite avec ralentissement)
- **KillBall** (balles bleues) : Poursuivent les RepaireBalls
- Utilisent le comportement "seek" pour se diriger vers leur cible
- Ralentissent progressivement en approchant (arrive behavior avec `slowRadius`)
- **DANGER** : Si votre balle touche une KillBall → **Game Over**, la page se recharge
- **SmallBalls** : Lors de la creation d'un nouveau hoop, les SmallBalls se deplace vers le nouveau hoop et s'arretent lorsequ'elles arrivent a bon port.
- Ils ont des points autour du hoop appeler "Home", chaque hope appartient a une smallball, les smallballs ne se trompent pas de home.

### 4. **Wander** (Errance)
- La **FearBall** utilise un comportement de wander pour se déplacer aléatoirement
- Il y a un cercle de prédiction devant la balle qui change de direction progressivement

##  Objectif et Scoring

### Gagner des points
- Toucher un **Hoop** (anneau) = **+10 points × Streak**
- Les **SmallBalls** du Hoop s'éparpillent puis reviennent (comportement flee + return home)
- Le Hoop se repositionne aléatoirement sur l'écran

### Pénalités
- Toucher un **mur** = **-1 point** et reset du streak

### Système de Streak
- **Augmentation** : Toucher un anneau avec **une seule action** (1 push ou 1 pull)
-  Utiliser une 2ème action sans toucher l'anneau **Reset à 1** le streak:
-  Sons différents selon le niveau de streak : "Ok" → "Good" x 2 → "Great!" x 3 → "Excellent!!!" → "Holy!!"
-  Les sons sont tirer du jeu " Mario et Luigi : Dream Team "

##  Modes de Jeu

### Mode Normal
- **2 Pulls** disponibles
- **3 Pushes** disponibles
- Le jeu se termine quand les deux ressources sont épuisées

### Mode Infini
- **3000 Pulls** disponibles
- **3000 Pushes** disponibles
- Pour se familiariser avec les touches et la physique du jeu.

## Fichiers principaux
- `CONFIG.js` : Configuration centralisée (constantes physiques, paramètres de jeu)
- `Ball.js` : Balle principale du joueur (physique + steering behaviors)
- `KillBall.js` : Ennemis qui suivent les RepaireBalls dans le chemin autour de l'ecran.
- `RepaireBall.js` : Balles qui suivent le path rectangulaire
- `FearBall.js` : Balle avec comportement wander + rayon de peur
- `Hoop.js` : Anneaux à traverser avec la Ball.
- `SmallBalls.js` : Petites balles composant les hoops
- `Path.js` : Chemin rectangulaire autour de l'écran
- `GameManager.js` : Gestion du score, streak, ressources
- `GameMenu.js` : Menu principal et instructions
- `sketch.js` : Boucle principale du jeu

##  Comment y jouer

https://jetaofgak.github.io/HooperP5-Taoufik-Dahami/
