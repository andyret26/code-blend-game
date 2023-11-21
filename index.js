import { CreateCircle } from "./CreateCircle.js";
import { CreateGameBoard } from "./world.js";

// Create PIXI.js application
const app = new PIXI.Application({
  background: "#FBF4DA",
  resizeTo: window,
});

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

const circles = [];

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
        // Perform actions when a collision with the ground occurs
        console.log(circleObjA);

        // you can change the color of the circle
        circleObjA.circle.tint = 0xff0000; // This will turn the circle red
        const x = circleObjA.body.position.x;
        const y = circleObjA.body.position.y;
        const radius = circleObjA.size + 20;
        console.log(x, y);

        // remove colliding circles from the stage
        app.stage.removeChild(circleObjA.circle);
        app.stage.removeChild(circleObjB.circle);
        // remove colliding circles from the circles array
        circles.splice(circles.indexOf(circleObjA), 1);
        circles.splice(circles.indexOf(circleObjB), 1);
        // remove colliding circles from the Matter.js world
        Matter.World.remove(engine.world, circleObjA.body);
        Matter.World.remove(engine.world, circleObjB.body);

        const circle = CreateCircle(0xffffff, radius, x, y);
        app.stage.addChild(circle);

        // Create Matter.js body for each circle
        const circleBody = Matter.Bodies.circle(circle.x, circle.y, radius, {
          restitution: 0.5,
        });
        Matter.World.add(engine.world, circleBody);

        const ticker = app.ticker.add(() => {
          // Update PIXI.js sprite position based on Matter.js body position
          circle.position.set(circleBody.position.x, circleBody.position.y);

          // Apply gravity to the circle
          Matter.Body.applyForce(circleBody, circleBody.position, {
            x: 0,
            y: 0.002,
          });
        });

        circle.interactive = true;

        circles.push({ circle, ticker, body: circleBody, size: radius });
      }
    }
  }
});

document.body.onclick = (event) => {
  const radiusList = [20, 40, 60, 80, 100];
  const radius = radiusList[Math.floor(Math.random() * radiusList.length)];
  // const circle = new PIXI.Graphics();
  // circle.beginFill(0xffffff);
  // circle.drawCircle(0, 0, radius);
  // circle.endFill();
  // circle.x = event.clientX;
  // circle.y = 0;
  const circle = CreateCircle(0xffffff, radius, event.clientX, 0);
  app.stage.addChild(circle);

  // Create Matter.js body for each circle
  const circleBody = Matter.Bodies.circle(circle.x, circle.y, radius, {
    restitution: 0.5,
  });
  Matter.World.add(engine.world, circleBody);

  const ticker = app.ticker.add(() => {
    // Update PIXI.js sprite position based on Matter.js body position
    circle.position.set(circleBody.position.x, circleBody.position.y);

    // Apply gravity to the circle
    Matter.Body.applyForce(circleBody, circleBody.position, { x: 0, y: 0.002 });
  });

  circle.interactive = true;

  circles.push({ circle, ticker, body: circleBody, size: radius });
};
