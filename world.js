export function CreateGameBoard(engine, render, app) {
  // Set up Matter.js container with walls
  const containerHeight = app.screen.height - 50;

  const leftWallPosition = app.screen.width / 2 - 300;
  const rightWallPosition = app.screen.width / 2 + 300;

  const horizontalLinePosition = app.screen.height - 800

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
  const horizontalLine = Matter.Bodies.rectangle(
    app.screen.width / 2,
    horizontalLinePosition,
    app.screen.width,
    5,
    { isStatic: true, isSensor: true }
  );
  Matter.World.add(engine.world, [
    container,
    leftWall,
    rightWall,
    ground,
    horizontalLine,
  ]);

  // Create PIXI.js graphics for walls and ground
  const groundGraphics = new PIXI.Graphics();
  groundGraphics.beginFill(0x996633);
  groundGraphics.drawRect(0, app.screen.height - 50, app.screen.width, 50);
  groundGraphics.endFill();
  app.stage.addChild(groundGraphics);

  const lineGraphics = new PIXI.Graphics();
  lineGraphics.beginFill(0xec2024, 0.6);
  lineGraphics.drawRect(
    (app.screen.width - 600) / 2,
    horizontalLinePosition,
    600,
    5
  );
  lineGraphics.endFill();
  app.stage.addChild(lineGraphics);

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
  Matter.Runner.run(engine);
  Matter.Runner.run(render);
}
