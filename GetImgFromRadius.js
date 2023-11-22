export function GetImgFromRadius(radius) {
    const orbTypes = ["Html", "Css", "Js", "TS", "ang", "React", "Java", "net", "Db", "AZ", "ex"];
    const baseRadius = 20;
    const increment = 15;
    // Calculate the index based on the base radius and increment
    // index = (radius-baseRadius)/increment
    const index = Math.floor((radius - baseRadius) / increment);

    // Check if the index is within the valid range
    if (index >= 0 && index < orbTypes.length) {
        return `./assets/orbs/${orbTypes[index]}.png`;
    }

    // Handle the case where the radius doesn't match any orb type
}