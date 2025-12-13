class GameManager {
    constructor(s, pul,pus) {
        this.score = s;
        this.streak = 1;
        this.numberOfPullsOriginal = pul;
        this.numberOfPushOriginal = pus;
        this.numberOfPulls = pul;
        this.numberOfPush = pus;
        this.AlreadyStreaked = false;
        this.okState = " "
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

    playSoundStreak()
    {        
        switch (this.streak)
        {
            case 0: soundEffects[7].play(); console.log("Etats du streak 1:" + this.streak); this.okState = "Aie.....";break;
            case 2: soundEffects[0].play(); console.log("Etats du streak 2:" + this.streak); this.okState = "Ok";break;
            case 3: soundEffects[1].play(); console.log("Etats du streak 3:" + this.streak); this.okState = "Good";break;
            case 4: soundEffects[2].play(); console.log("Etats du streak 4:" + this.streak); this.okState = "Good";break;
            case 5: soundEffects[3].play(); console.log("Etats du streak 5:" + this.streak); this.okState = "Great!";break;
            case 6: soundEffects[4].play(); console.log("Etats du streak 6:" + this.streak); this.okState = "Great!!";break;
            case 7: soundEffects[5].play(); console.log("Etats du streak 7:" + this.streak); this.okState = "Great!!!";break;
            case 8: soundEffects[6].play(); console.log("Etats du streak 8:" + this.streak); this.okState = "Excellent!!!";break;
            default: soundEffects[6].play(); console.log("Etats du streak exed:" + this.streak); this.okState = "Holy!!";break;

        }
    }

    addStreak() {
        this.AlreadyStreaked = true;
        this.streak += 1;
        this.playSoundStreak();
        
    }

    resetStreak() {
        this.streak = 0;
        if(this.AlreadyStreaked )
        {
           this.playSoundStreak(); 
        }
        this.streak = 1;
        
        this.AlreadyStreaked = false;
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