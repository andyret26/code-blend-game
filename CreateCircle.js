export function CreateCircle(app, matter, engine, color, radius, spawnX, spawnY) {
    let circle = new PIXI.Graphics();
    circle.beginFill(color);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    circle.x = spawnX;
    circle.y = spawnY;
    circle.interactive = true;

    const circleBody = Matter.Bodies.circle(circle.x, circle.y, radius, {
        restitution: 0.5,
      });

    const tickerfunc = () => {
        circle.position.set(circleBody.position.x, circleBody.position.y);

        // Apply gravity to the circle
        Matter.Body.applyForce(circleBody, circleBody.position, { x: 0, y: 0.002 });
    }
    
    app.stage.addChild(circle)
    matter.World.add(engine.world, circleBody);




    return [circle, circleBody, tickerfunc];
}

export function test(app, circle) {
}