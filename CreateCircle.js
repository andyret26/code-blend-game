export function CreateCircle(color = 0xffffff, radius, spawnX, spawnY) {
    let circle = new PIXI.Graphics();
    circle.beginFill(color);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    circle.x = spawnX;
    circle.y = spawnY;
    return circle;
}