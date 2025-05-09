import { size, Cords, blockedCords, grass, locationSizes } from "./const";

export class Location {
    name: string;
    src: string;
    blockedCords: Cords[];
    grass: Cords[];
    width: number;
    height: number;

    constructor(name: string) {
        this.name = name;
        this.src = `./src/gfx/${this.name}.png`;
        this.blockedCords = blockedCords[name];
        this.grass = grass[name];
        this.width = locationSizes[name].x;
        this.height = locationSizes[name].y;
    }

    renderLocation(cords: Cords) {
        const x = -cords.x * size + 4 * size;
        const y = -cords.y * size + 4 * size;
        document.getElementById("pf")!.style.backgroundPosition = `${x}px ${y}px`;
        if (this.grass.some((e) => { return e.x == cords.x && e.y == cords.y })) {
            document.getElementById("player-overlay")!.style.display = "block";
        }
        else {
            document.getElementById("player-overlay")!.style.display = "none";
        }
    }
}