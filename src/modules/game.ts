import { Player } from "./player";
import { Location } from "./location";
import { playerFrames } from "./const";

export class Game {
    blockMovement: boolean = false;
    player: Player;
    location: Location;
    showMenu: boolean = false;

    constructor(player: Player, location: Location) {
        this.player = player;
        this.location = location;
    }

    start() {
        const cont = document.createElement("div");
        cont.id = "container";
        const pfCont = document.createElement("div");
        pfCont.id = "pf";
        const playerCont = document.createElement("div");
        playerCont.id = "player";
        const playerOverlay = document.createElement("div");
        playerOverlay.id = "player-overlay";

        playerCont.append(playerOverlay);
        pfCont.append(playerCont);
        cont.append(pfCont);
        document.body.append(cont);
        this.setLocation(this.location);
        this.render();
        this.initControls();

        const mainMenu = document.createElement("div");
        mainMenu.id = "main-menu";
        pfCont.append(mainMenu);
    }

    render() {
        this.player.img.onload = () => { this.player.renderPlayer(1) };
        this.location.renderLocation(this.player.cords);
    }

    setLocation(location: Location) {
        this.location = location;
        document.getElementById("pf")!.style.backgroundImage = `url(${this.location.src})`;
        this.location.renderLocation(this.player.cords);
    }

    changeMenu() {
        this.showMenu = !this.showMenu;
        if (this.showMenu)
            document.getElementById("main-menu")!.style.display = "block";
        else
            document.getElementById("main-menu")!.style.display = "none";
    }

    moveBack() {
        if (this.player.walkingFrame == 1) {
            this.player.walkingFrame += 1;
            this.player.renderPlayer(playerFrames["back-walk-2"]);
        }
        else {
            this.player.walkingFrame -= 1;
            this.player.renderPlayer(playerFrames["back-walk-1"]);
        }
        if (!(this.player.cords.y - 1 < 0) && !this.location.blockedCords.some((e) => { return e.x == this.player.cords.x && e.y == this.player.cords.y - 1 }))
            this.player.cords.y -= 1;
        this.location.renderLocation(this.player.cords);
        this.blockMovement = true;

        new Promise((resolve) => {
            setTimeout(() => {
                this.player.renderPlayer(playerFrames["back"]);
            }, 100);
            setTimeout(() => {
                this.blockMovement = false;
                resolve;
            }, 200);
        });
    }

    moveFront() {
        if (this.player.walkingFrame == 1) {
            this.player.walkingFrame += 1;
            this.player.renderPlayer(playerFrames["front-walk-2"]);
        }
        else {
            this.player.walkingFrame -= 1;
            this.player.renderPlayer(playerFrames["front-walk-1"]);
        }
        if (!(this.player.cords.y + 1 >= this.location.height) && !this.location.blockedCords.some((e) => { return e.x == this.player.cords.x && e.y == this.player.cords.y + 1 }))
            this.player.cords.y += 1;
        this.location.renderLocation(this.player.cords);
        this.blockMovement = true;

        new Promise((resolve) => {
            setTimeout(() => {
                this.player.renderPlayer(playerFrames["front"]);
            }, 100);
            setTimeout(() => {
                this.blockMovement = false;
                resolve;
            }, 200);
        });
    }

    moveLeft() {
        this.player.renderPlayer(playerFrames["left-walk"]);
        if (!(this.player.cords.x - 1 < 0) && !this.location.blockedCords.some((e) => { return e.x == this.player.cords.x - 1 && e.y == this.player.cords.y }))
            this.player.cords.x -= 1;
        this.location.renderLocation(this.player.cords);
        this.blockMovement = true;

        new Promise((resolve) => {
            setTimeout(() => {
                this.player.renderPlayer(playerFrames["left"]);
            }, 100);
            setTimeout(() => {
                this.blockMovement = false;
                resolve;
            }, 200);
        });
    }

    moveRight() {
        this.player.renderPlayer(playerFrames["right-walk"]);
        if (!(this.player.cords.x + 1 >= this.location.width) && !this.location.blockedCords.some((e) => { return e.x == this.player.cords.x + 1 && e.y == this.player.cords.y }))
            this.player.cords.x += 1;
        this.location.renderLocation(this.player.cords);
        this.blockMovement = true;

        new Promise((resolve) => {
            setTimeout(() => {
                this.player.renderPlayer(playerFrames["right"]);
            }, 100);
            setTimeout(() => {
                this.blockMovement = false;
                resolve;
            }, 200);
        });
    }

    initControls() {
        document.body.addEventListener("keydown", async (event) => {
            if (!this.blockMovement && !this.showMenu) {
                if (event.key.toLowerCase() === "w") {
                    this.moveBack();
                }
                else if (event.key.toLowerCase() === "s") {
                    this.moveFront();
                }
                else if (event.key.toLowerCase() === "a") {
                    this.moveLeft();
                }
                else if (event.key.toLowerCase() === "d") {
                    this.moveRight();
                }
                console.log(this.player.cords.x, this.player.cords.y);
            }
            if (event.key.toLowerCase() === "e") {
                this.changeMenu();
            }
        });
    }
}