// Scalar Projection (Scalar Projection)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/DHPfoqiE4yQ
// https://thecodingtrain.com/learning/nature-of-code/5.6-dot-product.html
// Angle Between: https://editor.p5js.org/codingtrain/sketches/ORP5Yx7JX

let ball;
let hoop;
let gm;
let executeEnd;
function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = new Ball(width / 2, 100, 15, 0.1,2);
  hoop = new Hoop(width / 2, height - 100, 100,radians(random(0,90)), 30);
  gm = new GameManager(0,2,3);
}

function draw() {
  background(100);
  gm.displayScore();
  hoop.draw();
  hoop.ellipseTouched();

  //Dessiner la forme de la classe Ball dans la canvas
  ellipse(ball.pos.x, ball.pos.y, ball.r * 2);
  //Dessiner la forme de la classe hoop dans la canvas
 
  //Rendre la ball rouge
  fill(255, 0, 0);

  ball.applyGravity(0.1);
  ball.mousePressed(35);
  ball.airDrag(0.001);
  ball.updatePosition();

  hoop.remigration();

  if (gm.outOfPulls() && gm.outOfPush()) {
    executeEnd = setTimeout(() => {
    gm.resetGame();}, 5000);
  }
  if (!gm.outOfPulls() || !gm.outOfPush()) {
    clearTimeout(executeEnd);
  }

}



