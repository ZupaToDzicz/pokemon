import { size, Cords } from "./interface";
import blockedCordsData from '../data/blocked_cords.json'
import grassData from '../data/grass.json'
import locationDataJSON from '../data/location_data.json'

const blockedCords: { [key: string]: Cords[] } = blockedCordsData;
const grass: { [key: string]: Cords[] } = grassData;
const locationData: { [key: string]: { [key: string]: any } } = locationDataJSON;

export class Location {
    name: string;
    src: string;
    blockedCords: Cords[];
    grass: Cords[];
    width: number;
    height: number;
    pokemon: string[];
    level: { min: number, max: number };
    spawnCount: number;
    spawnCords: Cords[];

    constructor(name: string) {
        this.name = name;
        this.src = `./src/gfx/${this.name}.png`;
        this.blockedCords = blockedCords[name];
        this.grass = grass[name];
        this.width = locationData[name].size.x;
        this.height = locationData[name].size.y;
        this.pokemon = locationData[name].pokemon;
        this.level = locationData[name].level;
        this.spawnCount = locationData[name].spawn;
        this.spawnCords = [];
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

    setSpawnCords() {
        this.spawnCords = [];

        for (let i = 0; i < this.spawnCount; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);

            if (this.grass.some((e) => { return e.x == x && e.y == y }) && !this.spawnCords.some(e => { return e.x == x && e.y == y })) {
                this.spawnCords.push({ x: x, y: y });
            }
            else i--;
        }
        // console.log(this.spawnCords);
    }
}