export function CheckGameEdge(app, xPos) {
    const leftWallPosition = app.screen.width / 2 - 300;
    const rightWallPosition = app.screen.width / 2 + 300;
    return (leftWallPosition > xPos || rightWallPosition < xPos);
}