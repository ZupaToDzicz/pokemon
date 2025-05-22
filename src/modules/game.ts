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
    showMenu: string = "";
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

    changeMenu() {
        if (this.showMenu == "pokemon") {
            this.player.renderPokemon(this.player.cursor);
            this.pokemonMenu();
        }
        else if (this.showMenu == "pokemon-options") {
            this.pokemonMenuOpt();
        }
        else if (this.showMenu == "switch-pokemon") {
            this.pokemonMenuSwitch();
        }
        else if (this.showMenu == "") {
            document.getElementById("pokemon-menu")!.style.display = "none";
        }
    }

    pokemonMenu(event?: KeyboardEvent) {
        document.getElementById("pokemon-menu")!.style.display = "grid";
        document.getElementById("menu-text")!.innerText = 'Choose a POKéMON.';

        document.getElementById("cursor-col")!.innerHTML = '';
        const cursor = document.createElement("div");
        cursor.classList.add("cursor");
        cursor.id = "main-cursor";
        document.getElementById("cursor-col")!.append(cursor);

        if (event) {
            if (event.key.toLowerCase() === "s" && this.player.cursor + 1 < this.player.pokemon.length) {
                this.player.cursor += 1;
            }
            else if (event.key.toLowerCase() === "w" && this.player.cursor - 1 >= 0) {
                this.player.cursor -= 1;
            }
    
            else if (event.key === "Enter") {
                cursor.style.top = `${64 + 64 * this.player.cursor}px`;
                this.showMenu = "pokemon-options";
                this.changeMenu();
                cursor.classList.add("cursor-outline");
                this.player.optionCursor = 0;
                this.player.switchCursor = 0;
            }
        }

        cursor.style.top = `${64 + 64 * this.player.cursor}px`;
    }

    pokemonMenuOpt(event?: KeyboardEvent) {
        document.getElementById("cursor-col-opt")!.innerHTML = '';
        const pokemonOptions = document.getElementById("pokemon-options")!;
        pokemonOptions.style.display = "block";

        const optionCursor = document.createElement("div");
        optionCursor.classList.add("cursor");
        document.getElementById("cursor-col-opt")!.append(optionCursor);

        if (event) {
            if (event.key.toLowerCase() === "s" && this.player.optionCursor + 1 <= 2) {
                this.player.optionCursor += 1;
            }
            else if (event.key.toLowerCase() === "w" && this.player.optionCursor - 1 >= 0) {
                this.player.optionCursor -= 1;
            }
    
            else if (event.key === "Enter") {
                if (this.player.optionCursor == 1) {
                    pokemonOptions.style.display = "none";
                    this.showMenu = "switch-pokemon";
                    this.changeMenu();
                    this.player.optionCursor = 0;
                    this.player.switchCursor = 0;
                }
                else if (this.player.optionCursor == 2) {
                    pokemonOptions.style.display = "none";
                    this.showMenu = "pokemon";
                    this.changeMenu();
                    this.player.optionCursor = 0;
                    this.player.switchCursor = 0;
                    document.getElementById("main-cursor")!.classList.remove("cursor-outline");
                }
            }
        }

        optionCursor.style.top = `${64 * this.player.optionCursor}px`;
    }

    pokemonMenuSwitch(event?: KeyboardEvent) {
        document.getElementById("cursor-col")!.innerHTML = '';
        const cursor = document.createElement("div");
        cursor.classList.add("cursor");
        cursor.id = "main-cursor";
        document.getElementById("cursor-col")!.append(cursor);
        cursor.classList.add("cursor-outline");
        cursor.style.top = `${64 + 64 * this.player.cursor}px`;

        const switchCursor = document.createElement("div");
        switchCursor.classList.add("cursor");
        document.getElementById("cursor-col")!.append(switchCursor);

        document.getElementById("menu-text")!.innerText = 'Move POKéMON where?';

        if (event) {
            if (event.key.toLowerCase() === "s" && this.player.switchCursor + 1 < this.player.pokemon.length) {
                this.player.switchCursor += 1;
            }
            else if (event.key.toLowerCase() === "w" && this.player.switchCursor - 1 >= 0) {
                this.player.switchCursor -= 1;
            }
            else if (event.key == "Enter") {
                this.player.switchPokemon(this.player.cursor, this.player.switchCursor);
                this.showMenu = "pokemon";
                this.player.renderPokemon(this.player.switchCursor);
                this.changeMenu();
            }
        }

        switchCursor.style.top = `${64 + 64 * this.player.switchCursor}px`;
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
            if (this.battle === undefined) {
                if (!this.blockMovement && this.showMenu == "") {
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
                            // console.log('A wild pokemon appeard!');
                            this.blockMovement = true;
                            this.battle = new Battle(this.spawnPokemon(), this.player);
                            this.battle.loadBattleScreen();
                        }
                    }, 200);
                }

                if (event.key.toLowerCase() === "e") {
                    if (this.showMenu == "") {
                        this.player.cursor = 0;
                        this.showMenu = "pokemon";
                        this.changeMenu();
                        // this.player.renderPokemon();
                    }
                    else if (this.showMenu == "pokemon") {
                        this.showMenu = "";
                        this.changeMenu();
                    }
                }
            }

            if (this.showMenu == "pokemon") {
                this.pokemonMenu(event);
            }

            else if (this.showMenu == "pokemon-options") {
                this.pokemonMenuOpt(event);
            }

            else if (this.showMenu == "switch-pokemon") {
                this.pokemonMenuSwitch(event);
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