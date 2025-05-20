import { Player } from "./player";
import { Location } from "./location";
import { Pokemon } from "./pokemon";
import { Battle } from "./battle";
import framesData from "../data/frames.json"

const frames: { [key: string]: { [key: string]: number } } = framesData;
const playerFrames: { [key: string]: number } = frames['player-frames'];

export class Game {
    blockMovement: boolean = false;
    player: Player;
    location: Location;
    showMenu: boolean = false;
    battle: (Battle | undefined) = undefined;

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

        // const mainMenu = document.createElement("div");
        // mainMenu.id = "main-menu";
        // pfCont.append(mainMenu);

        const pokemonMenu = document.createElement("div");
        pokemonMenu.id = "pokemon-menu";
        pfCont.append(pokemonMenu);

        const battleCont = document.createElement("div");
        battleCont.id = "battle-cont";
        pfCont.append(battleCont);
    }

    render() {
        this.player.img.onload = () => { this.player.renderPlayer(1) };
        this.location.renderLocation(this.player.cords);
    }

    setLocation(location: Location) {
        this.location = location;
        document.getElementById("pf")!.style.backgroundImage = `url(${this.location.src})`;
        this.location.renderLocation(this.player.cords);
        this.location.setSpawnCords();
    }

    // changeMenu() {
    //     this.showMenu = !this.showMenu;
    //     if (this.showMenu)
    //         document.getElementById("main-menu")!.style.display = "block";
    //     else
    //         document.getElementById("main-menu")!.style.display = "none";
    // }

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
            if (this.battle === undefined) {
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
    
                    // console.log(this.player.cords.x, this.player.cords.y);
    
                    setTimeout(() => {
                        if (this.checkSpawn()) {
                            console.log('A wild pokemon appeard!');
                            this.blockMovement = true;
                            this.battle = new Battle(this.spawnPokemon(), this.player);
                            this.battle.loadBattleScreen();
                        }
                        else {
                            console.log('Nothing here :c');
                        }
                    }, 200);
                }
    
                if (event.key.toLowerCase() === "e") {
                    this.player.showPokemon();
                }
            }
        });
    }

    checkSpawn(): boolean {
        if (this.location.spawnCords.some(e => { return e.x == this.player.cords.x && e.y == this.player.cords.y })) {
            return true;
        }
        return false;
    }

    spawnPokemon() {
        const minLevel = this.location.level.min;
        const maxLevel = this.location.level.max;
        const pokemonName = this.location.pokemon[Math.floor(Math.random() * this.location.pokemon.length)];
        const pokemonLevel = Math.floor(Math.random() * (maxLevel - minLevel)) + minLevel;

        const wildPokemon = new Pokemon(pokemonName, pokemonLevel);
        return wildPokemon;
    }
}