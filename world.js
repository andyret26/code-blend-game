export function CreateGameBoard(engine, render, app) {
  // Set up Matter.js container with walls
  const containerHeight = app.screen.height - 50;

  const leftWallPosition = app.screen.width / 2 - 300;
  const rightWallPosition = app.screen.width / 2 + 300;

  const container = Matter.Composite.create();
  const leftWall = Matter.Bodies.rectangle(
    leftWallPosition,
    app.screen.height / 2,
    10,
    containerHeight,
    { isStatic: true }
  );
  const rightWall = Matter.Bodies.rectangle(
    rightWallPosition,
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
  leftWallGraphics.drawRect(leftWallPosition, 0, 10, app.screen.height);
  leftWallGraphics.endFill();
  app.stage.addChild(leftWallGraphics);

  const rightWallGraphics = new PIXI.Graphics();
  rightWallGraphics.beginFill(0x996633);
  rightWallGraphics.drawRect(rightWallPosition, 0, 10, app.screen.height);
  rightWallGraphics.endFill();
  app.stage.addChild(rightWallGraphics);

  // Run Matter.js engine and renderer
  Matter.Engine.run(engine);
  Matter.Render.run(render);
}
