import { size } from "./const";
import { Cords } from "./const";

export class Player {
    img: HTMLImageElement;
    cords: Cords;
    walkingFrame: number;
    name: string;

    constructor(name: string, x?: number, y?: number) {
        this.name = name;
        this.img = new Image();
        this.img.src = "./src/gfx/player-sprite.png";
        this.cords = (x && y) ? { x: x, y: y } : { x: 0, y: 0 };
        this.walkingFrame = 1;
    }

    renderPlayer(frame: number) {
        const playerCanvas = document.createElement("canvas");
        playerCanvas.width = size;
        playerCanvas.height = size;
        const ctx = playerCanvas.getContext("2d");

        ctx!.drawImage(this.img, frame * size, 0, size, size, 0, 0, size, size);
        const url = playerCanvas.toDataURL();
        document.getElementById("player")!.style.backgroundImage = `url("${url}")`;
    }

    setCoords(x: number, y: number) {
        this.cords = { x: x, y: y };
    }
}