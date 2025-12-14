class GameManager {
  constructor(s, pul, pus) {
    this.score = s;
    this.streak = 1;
    this.numberOfPullsOriginal = pul;
    this.numberOfPushOriginal = pus;
    this.numberOfPulls = pul;
    this.numberOfPush = pus;
    this.AlreadyStreaked = false;
    this.okState = " ";
    
    // Configuration des streaks 
    this.streakConfig = [
      { sound: 7, text: "Streak Reset..." },      // streak 0
      { sound: null, text: "" },            // streak 1 (pas de son)
      { sound: 0, text: "Ok" },             // streak 2
      { sound: 1, text: "Good" },           // streak 3
      { sound: 2, text: "Good" },           // streak 4
      { sound: 3, text: "Great!" },         // streak 5
      { sound: 4, text: "Great!!" },        // streak 6
      { sound: 5, text: "Great!!!" },       // streak 7
      { sound: 6, text: "Excellent!!!" }    // streak 8
    ];
    this.defaultStreak = { sound: 6, text: "Holy!!" }; // streak > 8
  }

  displayScore() {
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Score: " + this.score + " Streak: " + this.streak, 10, 10);
    textAlign(RIGHT, TOP);
    text("Pulls: " + this.numberOfPulls + " Pushes: " + this.numberOfPush, width - 10, 10);
  }

  updateScore(points) {
    this.score += points * this.streak;
  }

  playSoundStreak() {
    const config = this.streakConfig[this.streak] || this.defaultStreak;
    
    if (config.sound !== null) {
      soundEffects[config.sound].play();
    }
    
    this.okState = config.text;
    console.log("Streak " + this.streak + ": " + this.okState);
  }

  addStreak() {
    this.AlreadyStreaked = true;
    this.streak += 1;
    this.playSoundStreak();
  }

  //Fait passer  le streak a 0 pour pouvoir jouer le son puis a 1 pour que le reset soit correct. Code Pansement.
  resetStreak() {
    this.streak = 0;
    if (this.AlreadyStreaked) {
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
    this.numberOfPulls = this.numberOfPullsOriginal;
    this.numberOfPush = this.numberOfPushOriginal;
  }

  resetGame() {
    this.resetPullsAndPush();
    this.score = 0;
    this.streak = 1;
  }
}
