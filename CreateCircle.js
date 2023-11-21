export function CreateCircle(app, color, radius, spawnX, spawnY) {
    let circle = new PIXI.Graphics();
    circle.beginFill(color);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    circle.x = spawnX;
    circle.y = spawnY;
    circle.interactive = true;
    
    app.stage.addChild(circle)



    return circle;
}

export function AddBodyTicker(app, matter, engine, circle, radius) {
    
    const circleBody = matter.Bodies.circle(circle.x, circle.y, radius, {
        restitution: 0.5,
      });

    const tickerfunc = () => {
        circle.position.set(circleBody.position.x, circleBody.position.y);

        // Apply gravity to the circle
        matter.Body.applyForce(circleBody, circleBody.position, { x: 0, y: 0.002 });
    }
    
    matter.World.add(engine.world, circleBody);
    app.ticker.add(tickerfunc);
    return circleBody;
}