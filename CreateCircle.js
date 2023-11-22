export function CreateCircle(app, radius, spawnX, spawnY, imagePath) {
  // Create a new PIXI.Sprite with the specified image path
  let sprite = new PIXI.Sprite(PIXI.Texture.from(imagePath));

  // Calculate the aspect ratio of the original image
  const aspectRatio = sprite.width / sprite.height;

  // Set the anchor point to the center of the sprite
  sprite.anchor.set(0.5);

  // Set the scale of the sprite to match the desired circle radius while maintaining aspect ratio
  sprite.width = radius * 2;
  sprite.height = (radius * 2) / aspectRatio;

  // Set the position of the sprite
  sprite.x = spawnX;
  sprite.y = spawnY;

  // Make the sprite interactive
  sprite.interactive = true;

  // Add the sprite to the stage
  app.stage.addChild(sprite);

  return sprite;
}

export function AddBodyTicker(app, matter, engine, circle, radius) {
  const circleBody = matter.Bodies.circle(circle.x, circle.y, radius, {
    restitution: 0.5,
  });

  const tickerfunc = () => {
    circle.position.set(circleBody.position.x, circleBody.position.y);

    // Apply gravity to the circle
    matter.Body.applyForce(circleBody, circleBody.position, { x: 0, y: 0.002 });
  };

  matter.World.add(engine.world, circleBody);
  app.ticker.add(tickerfunc);
  return circleBody;
}
