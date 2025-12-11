class GameManager {
    constructor(s, pul,pus) {
        this.score = s;
        this.streak = 1;
        this.numberOfPullsOriginal = pul;
        this.numberOfPushOriginal = pus;
        this.numberOfPulls = pul;
        this.numberOfPush = pus;
    }
    displayScore() {
        fill(255);
        textSize(24);
        textAlign(LEFT, TOP);
        text("Score: " + this.score + "Streak: "+ this.streak, 10, 10);
        textAlign(RIGHT, TOP);
        text("Pulls: " + this.numberOfPulls + " Pushes: " + this.numberOfPush, width - 10, 10);
        
    }
    
    updateScore(points) {
        this.score += points * this.streak;
        
    }

    addStreak() {
        this.streak += 1;
        
    }

    resetStreak() {
        this.streak = 1;
    }
    outOfPulls() {
        return this.numberOfPulls <= 0;
    }
    outOfPush() {  
        return this.numberOfPush <= 0;
    }
    reducePulls() {
        if (this.numberOfPulls > 0) {
            this.numberOfPulls -= 1;
        }
    }
    reducePush() {
        if (this.numberOfPush > 0) {
            this.numberOfPush -= 1;
        }
    }
    resetPullsAndPush() {
        this.numberOfPulls = this.numberOfPullsOriginal  ;
        this.numberOfPush = this.numberOfPushOriginal ;
    }

    resetGame() {
        this.resetPullsAndPush();
        this.score = 0;
        this.streak = 1;

        
    }
}