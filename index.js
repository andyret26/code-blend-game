// Create PIXI.js application
const app = new PIXI.Application({
  background: "#1099bb",
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

// Set up Matter.js container with walls
const containerWidth = app.screen.width - 400;
const containerHeight = app.screen.height - 50;

const container = Matter.Composite.create();
const leftWall = Matter.Bodies.rectangle(
  200,
  app.screen.height / 2,
  10,
  containerHeight,
  { isStatic: true }
);
const rightWall = Matter.Bodies.rectangle(
  app.screen.width - 200,
  app.screen.height / 2,
  10,
  containerHeight,
  { isStatic: true }
);
const ground = Matter.Bodies.rectangle(
  app.screen.width / 2,
  app.screen.height - 25,
  app.screen.width,
  50,
  { isStatic: true, restitution: 0.5 }
);

Matter.World.add(engine.world, [container, leftWall, rightWall, ground]);

// Create PIXI.js graphics for walls and ground
const groundGraphics = new PIXI.Graphics();
groundGraphics.beginFill(0x996633);
groundGraphics.drawRect(0, app.screen.height - 50, app.screen.width, 50);
groundGraphics.endFill();
app.stage.addChild(groundGraphics);

const leftWallGraphics = new PIXI.Graphics();
leftWallGraphics.beginFill(0x996633);
leftWallGraphics.drawRect(200, 0, 10, app.screen.height);
leftWallGraphics.endFill();
app.stage.addChild(leftWallGraphics);

const rightWallGraphics = new PIXI.Graphics();
rightWallGraphics.beginFill(0x996633);
rightWallGraphics.drawRect(app.screen.width - 210, 0, 10, app.screen.height);
rightWallGraphics.endFill();
app.stage.addChild(rightWallGraphics);

// Run Matter.js engine and renderer
Matter.Engine.run(engine);
Matter.Render.run(render);

const circles = [];

// Add a collision event listener to detect collisions with the ground
Matter.Events.on(engine, 'collisionStart', (event) => {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    // Find corresponding circle objects for bodyA and bodyB
    const circleObjA = circles.find(circleObj => circleObj.body === pair.bodyA);
    const circleObjB = circles.find(circleObj => circleObj.body === pair.bodyB);

    // Check if one of the bodies is a circle and the other is the ground
    if (circleObjA && circleObjB) {
      // Perform actions when a collision with the ground occurs


      // you can change the color of the circle
      circleObjA.circle.tint = 0xff0000; // This will turn the circle red
    }
  }
});


document.body.onclick = (event) => {
  const radius = Math.floor(Math.random() * 100 + 20);
  const circle = new PIXI.Graphics();
  circle.beginFill(0xffffff);
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  circle.x = event.clientX;
  circle.y = 0;
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


  circles.push({ circle, ticker, body: circleBody, size: 1 });
};
