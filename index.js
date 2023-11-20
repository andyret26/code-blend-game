// Create PIXI.js application
const app = new PIXI.Application({
  background: "#1099bb",
  resizeTo: window,
});

document.body.appendChild(app.view);

// Create Matter.js engine
const engine = Matter.Engine.create();

// Create Matter.js renderer
const render = Matter.Render.create({
  element: document.body,
  engine: engine,
});

// Set up Matter.js ground
const ground = Matter.Bodies.rectangle(
  app.screen.width / 2,
  app.screen.height - 25,
  app.screen.width,
  50,
  { isStatic: true }
);
Matter.World.add(engine.world, ground);

// Run Matter.js engine and renderer
Matter.Engine.run(engine);
Matter.Render.run(render);

const bunnies = [];

document.body.onclick = () => {
  const bunny = PIXI.Sprite.from("https://pixijs.com/assets/bunny.png");
  bunny.anchor.set(0.5);
  bunny.x = Math.random() * app.screen.width;
  bunny.y = 0;
  app.stage.addChild(bunny);

  // Create Matter.js body for each bunny
  const bunnyBody = Matter.Bodies.rectangle(
    bunny.x,
    bunny.y,
    bunny.width,
    bunny.height
  );
  Matter.World.add(engine.world, bunnyBody);

  const ticker = app.ticker.add(() => {
    // Update PIXI.js sprite position based on Matter.js body position
    bunny.position.set(bunnyBody.position.x, bunnyBody.position.y);

    // Apply gravity to the bunny
    Matter.Body.applyForce(bunnyBody, bunnyBody.position, { x: 0, y: 0.002 });

    // Check for collision with the ground
    if (bunnyBody.position.y + bunny.height / 2 > app.screen.height - 25) {
      // Apply an impulse to simulate a bounce
      Matter.Body.applyForce(bunnyBody, bunnyBody.position, { x: 0, y: -0.02 });
    }
  });

  bunnies.push({ bunny, ticker, body: bunnyBody });
};
