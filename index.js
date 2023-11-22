import { CheckGameEdge } from "./CheckGameEdge.js";
import { AddBodyTicker, CreateCircle } from "./CreateCircle.js";
import { GetImgFromRadius } from "./GetImgFromRadius.js";
import { CreateGameBoard } from "./world.js";

setLeaderboard();
// Create PIXI.js application
const app = new PIXI.Application({
  background: "#FBF4DA",
  resizeTo: window,
});

let player = null;
const startBtn = document.getElementById("btn-start");
const inputFeild = document.getElementById("nameInput");
const startContainer = document.getElementById("startContainer");

const radiusList = [20, 35, 50, 65];
const radiusIncrement = 15;
let isStarted = false;
let score = 0;
let currentCircle = null;
const spawnY = app.screen.height - 650;

let nextCircle = null;

const nextOrbX = app.screen.width / 2 + 500;
const nextOrbY = app.screen.height / 2 - 200;

updateScore();

document.body.appendChild(app.view);

// Create Matter.js engine with fixed time step and increased iterations
const engine = Matter.Engine.create({
  timing: {
    timeScale: 1, // Adjust time scale as needed
  },
  positionIterations: 10, // Increase position iterations
  velocityIterations: 10, // Increase velocity iterations
});

// Create Matter.js renderer
const render = Matter.Render.create({
  element: document.body,
  engine: engine,
});

CreateGameBoard(engine, render, app);

let circles = [];

let collisionTimer = null;
let hasCollisionWithLine = false;
let timerDone = false;
let counting = false;
function startTImer() {
  if (!counting) {
    counting = true;
    collisionTimer = setTimeout(() => {
      timerDone = true;
    }, 1000);
  }
}

Matter.Events.on(engine, "collisionActive", (event) => {
  if (timerDone && circles.length > 3) {
    // game over
    // alert("game over");
    resetGame();
  }

  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (
      (pair.bodyA.id == 5 && pair.bodyB.label == "Circle Body") ||
      (pair.bodyB.id == 5 && pair.bodyA.label == "Circle Body")
    ) {
      hasCollisionWithLine = true;
      break;
    } else {
      hasCollisionWithLine = false;
    }
  }
  if (hasCollisionWithLine) {
    startTImer();
  } else {
    clearTimeout(collisionTimer);
    collisionTimer = null;
    counting = false;
    timerDone = false;
  }
});

// Add a collision event listener to detect collisions with the ground
Matter.Events.on(engine, "collisionStart", (event) => {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    // Find corresponding circle objects for bodyA and bodyB
    const circleObjA = circles.find(
      (circleObj) => circleObj.body === pair.bodyA
    );
    const circleObjB = circles.find(
      (circleObj) => circleObj.body === pair.bodyB
    );

    // Check if one of the bodies is a circle and the other is the ground
    if (circleObjA && circleObjB) {
      if (circleObjA.size === circleObjB.size) {
        // Check if one of the bodies is the line

        // Perform actions when a collision with the ground occurs
        // you can change the color of the circle
        circleObjA.circle.tint = 0xff0000; // This will turn the circle red
        const x = circleObjA.body.position.x;
        const y = circleObjA.body.position.y;
        const radius = circleObjA.size + radiusIncrement;

        //add radius to score
        score += radius;
        updateScore();

        // remove colliding circles from the stage
        app.stage.removeChild(circleObjA.circle);
        app.stage.removeChild(circleObjB.circle);
        // remove colliding circles from the circles array
        circles.splice(circles.indexOf(circleObjA), 1);
        circles.splice(circles.indexOf(circleObjB), 1);
        // remove colliding circles from the Matter.js world
        Matter.World.remove(engine.world, circleObjA.body);
        Matter.World.remove(engine.world, circleObjB.body);
        // change this to what is belowe

        const circle = CreateCircle(
          app,
          radius,
          x,
          y,
          GetImgFromRadius(radius)
        );
        const newCircleBody = AddBodyTicker(
          app,
          Matter,
          engine,
          circle,
          radius
        );

        circles.push({ circle: circle, size: radius, body: newCircleBody });
      }
    }
  }
});

let canClick = true;
document.getElementsByTagName("canvas")[0].addEventListener("click", (e) => {
  if (!isStarted) return;
  if (!canClick) return;
  if (CheckGameEdge(app, e.clientX)) return;

  // Manually update the Matter.js engine to ensure collision detection
  Matter.Engine.update(engine, engine.timing.delta);

  // Add physics and collision to the current circle so it drops
  const circleBody = AddBodyTicker(
    app,
    Matter,
    engine,
    currentCircle,
    currentCircle._height / 2
  );
  circles.push({
    circle: currentCircle,
    size: currentCircle._height / 2,
    body: circleBody,
  });

  currentCircle = nextCircle;
  currentCircle.position.set(e.clientX, spawnY);

  // Create a new current circle
  const radius = radiusList[Math.floor(Math.random() * radiusList.length)];
  nextCircle = CreateCircle(
    app,
    radius,
    nextOrbX + radius,
    nextOrbY,
    GetImgFromRadius(radius)
  );

  canClick = false;
  setTimeout(() => {
    canClick = true;
  }, 1000);
});

function updateScore() {
  document.getElementById("score").innerHTML = score;
}

startBtn.addEventListener("click", (e) => {
  isStarted = true;

  player = inputFeild.value;
  startContainer.style.display = "none";

  let radius = radiusList[Math.floor(Math.random() * radiusList.length)];
  let img = GetImgFromRadius(radius);
  currentCircle = CreateCircle(app, radius, e.clientX, spawnY, img);

  radius = radiusList[Math.floor(Math.random() * radiusList.length)];
  img = GetImgFromRadius(radius);
  nextCircle = CreateCircle(app, radius, nextOrbX + radius, nextOrbY, img);
});

app.view.addEventListener("mousemove", (e) => {
  if (!isStarted) return;
  if (CheckGameEdge(app, e.clientX)) return;
  currentCircle.position.set(e.clientX, spawnY);
});

// RESET GAME STATE
function resetGame() {
  // remove all matter body circles
  circles.forEach((circleObj) => {
    app.stage.removeChild(circleObj.circle);
    Matter.World.remove(engine.world, circleObj.body);
  });
  // Iterate through each child of the stage
  for (let i = app.stage.children.length - 1; i >= 0; i--) {
    const child = app.stage.children[i];

    // Check if the child is a sprite
    if (child instanceof PIXI.Sprite) {
      // Remove the sprite from the stage
      app.stage.removeChildAt(i);
    }
  }
  isStarted = false;
  setScoreStorage(score, "test");
  score = 0; 
  updateScore(); 
  circles = [];
  startContainer.style.display = "flex";
  
  
}


function setScoreStorage(score, name) {
  // set empty array if no score exists
  if(localStorage.getItem("score") === null) {
    localStorage.setItem("score", JSON.stringify([]));
  }

  // get current scores
  const currentScores = JSON.parse(localStorage.getItem("score"));
  console.log(currentScores)

  // add new score to array
  const test = { name: name, score: score }
  currentScores.push(test)

  localStorage.setItem("score", JSON.stringify(currentScores));
}

function setLeaderboard() {
  const currentScores = JSON.parse(localStorage.getItem("score"));
  console.log(currentScores)
  for (const item of currentScores) {
    const pToAdd = document.createElement("p");
    pToAdd.textContent = `${item.name} - ${item.score}`;
    const lb = document.getElementById("leaderboard-container").appendChild(pToAdd);
    
  }

}

document.getElementById("nameInput").addEventListener("input", () => {
  if (inputFeild.value.trim() !== "") {
    startBtn.disabled = false;
  } else {
    startBtn.disabled = true;
  }
});
