import { Player } from "./player";
import { Location } from "./location";
import { Pokemon } from "./pokemon";
import { Battle } from "./battle";
import framesData from "../data/frames.json"
import movesDataJSON from '../data/moves.json'

const frames: { [key: string]: { [key: string]: number } } = framesData;
const playerFrames: { [key: string]: number } = frames['player-frames'];
const movesData: { [key: string]: any } = movesDataJSON;

const cursorStyles = [
    'top: 64px; left: 32px;',
    'top: 128px; left: 32px;',
    'top: 64px; left: 224px;',
    'top: 128px; left: 224px;'
]

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
        else if (this.showMenu == "battle") {
            document.getElementById("pokemon-menu")!.style.display = "none";
            this.battle!.cursor = 0;
            this.battleMenu();
        }
        else if (this.showMenu == "fight") {
            this.battle!.cursor = 0;
            this.fightMenu();
        }
        else if (this.showMenu == "") {
            document.getElementById("pokemon-menu")!.style.display = "none";
            document.getElementById("battle-menu")!.style.display = "none";
            document.getElementById("fight-menu")!.style.display = "none";
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

            else if (event.key === "Escape") {
                if (this.battle) this.showMenu = "battle";
                else this.showMenu = "";
                this.changeMenu();
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
                    this.player.optionCursor = 0;
                    this.player.switchCursor = 0;
                    if (this.battle === undefined) {
                        pokemonOptions.style.display = "none";
                        this.showMenu = "switch-pokemon";
                        this.changeMenu();
                    }
                    else {
                        if (this.player.pokemon[this.player.cursor].isAlive()) {
                            this.showMenu = "";
                            this.changeMenu();

                            if (this.battle.playerPokemon == this.player.pokemon[this.player.cursor]) {
                                this.showMenu = "battle";
                                this.changeMenu();
                            }
                            else {
                                this.battle.playerPokemon = this.player.pokemon[this.player.cursor];
                                this.battle.loadBattleScreen();

                                this.battle!.setText(`Let's go ${this.battle!.playerPokemon!.name.toLocaleUpperCase()}!`);
                                setTimeout(() => {
                                    this.showMenu = "battle";
                                    this.changeMenu();
                                }, 1000);
                            }
                        }
                    }
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

        if (this.battle === undefined) {
            document.getElementById("menu-text")!.innerText = 'Move POKéMON where?';
        }

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

    battleMenu(event?: KeyboardEvent) {
        document.getElementById("fight-menu")!.style.display = "none";
        this.battle?.clearText();
        const battleMenu = document.getElementById("battle-menu")!;
        battleMenu.style.display = "block";
        battleMenu.innerHTML = "";

        const battleCursor = document.createElement("div");
        battleCursor.classList.add("cursor");
        battleMenu.append(battleCursor);

        if (event) {
            if (event.key.toLowerCase() === 's') {
                if (this.battle!.cursor == 0) this.battle!.cursor = 1;
                else if (this.battle!.cursor == 2) this.battle!.cursor = 3;
            }
            else if (event.key.toLowerCase() === 'w') {
                if (this.battle!.cursor == 1) this.battle!.cursor = 0;
                else if (this.battle!.cursor == 3) this.battle!.cursor = 2;
            }
            else if (event.key.toLowerCase() === 'd') {
                if (this.battle!.cursor == 0) this.battle!.cursor = 2;
                else if (this.battle!.cursor == 1) this.battle!.cursor = 3;
            }
            else if (event.key.toLowerCase() === 'a') {
                if (this.battle!.cursor == 2) this.battle!.cursor = 0;
                else if (this.battle!.cursor == 3) this.battle!.cursor = 1;
            }

            else if (event.key === 'Enter') {
                if (this.battle!.cursor == 0) {
                    this.showMenu = "fight";
                    this.changeMenu();
                }

                else if (this.battle!.cursor == 1) {

                }

                else if (this.battle!.cursor == 2) {
                    this.player.cursor = this.player.pokemon.indexOf(this.battle?.playerPokemon!);
                    this.showMenu = "pokemon";
                    this.changeMenu();
                }

                else if (this.battle!.cursor == 3) {
                    this.showMenu = "";
                    this.changeMenu();
                    document.getElementById("battle-text")!.innerText = "Got away safely!";
                    this.blockMovement = true;
                    setTimeout(() => {
                        this.battle = undefined;
                        this.blockMovement = false;
                        document.getElementById('battle-cont')!.style.display = "none";
                        this.location.setSpawnCords(this.player.cords);
                        this.spawnPokemon();
                    }, 1500);
                }
            }
        }

        battleCursor.style = cursorStyles[this.battle!.cursor];
    }

    fightMenu(event?: KeyboardEvent) {
        this.battle?.clearText();
        document.getElementById("battle-menu")!.style.display = "none";

        const fightMenu = document.getElementById("fight-menu")!;
        fightMenu.style.display = "block";
        fightMenu.innerHTML = "";

        const cursor = document.createElement("div");
        cursor.classList.add("cursor");
        fightMenu.append(cursor);

        const movesCont = document.createElement("div");
        movesCont.id = "moves-cont";
        fightMenu.append(movesCont);
        for (let i = 0; i < 4; i++) {
            const move = document.createElement("p");
            movesCont.append(move);

            if (this.battle!.playerPokemon!.moves[i]) {
                move.innerText = this.battle!.playerPokemon!.moves[i].name.toLocaleUpperCase();
            }
            else {
                move.innerText = "-";
            }
        }

        if (event) {
            if (event.key.toLowerCase() === "s" && this.battle!.cursor + 1 < this.battle!.playerPokemon!.moves.length) {
                this.battle!.cursor += 1;
            }
            else if (event.key.toLowerCase() === "w" && this.battle!.cursor - 1 >= 0) {
                this.battle!.cursor -= 1;
            }

            else if (event.key === "Enter") {
                if (this.battle!.playerPokemon!.moves[this.battle!.cursor].pp > 0) {
                    this.showMenu = "";
                    this.changeMenu();
                    this.blockMovement = true;

                    this.battle!.fight()
                        .then(() => {
                            this.battle!.clearText();
                            this.showMenu = "battle";
                            this.changeMenu();
                        })
                        .catch(() => {
                            if (!this.battle!.wildPokemon.isAlive()) {
                                this.showMenu = "";
                                this.changeMenu();
                                this.battle = undefined;
                                this.blockMovement = false;
                                document.getElementById('battle-cont')!.style.display = "none";
                                this.location.setSpawnCords(this.player.cords);
                                this.spawnPokemon();
                                this.player.pokemon.forEach(pkmn => {
                                    pkmn.recoverStats();
                                })
                            }

                            else {

                            }
                        })
                        .finally(() => {
                            this.blockMovement = false;
                        });
                }
            }

            else if (event.key === "Escape") {
                this.showMenu = "battle";
                this.changeMenu();
            }
        }

        cursor.style.top = `${160 + this.battle!.cursor * 32}px`;
        cursor.style.left = "160px";

        const moveType = document.createElement("div");
        moveType.id = "move-type";
        fightMenu.append(moveType);
        moveType.innerText = movesData[this.battle!.playerPokemon!.moves[this.battle!.cursor].name].type.toLocaleUpperCase();

        const movePP = document.createElement("div");
        movePP.id = "move-pp";
        fightMenu.append(movePP);
        movePP.innerText = `${this.battle!.playerPokemon!.moves[this.battle!.cursor].pp}/${movesData[this.battle!.playerPokemon!.moves[this.battle!.cursor].name].pp}`;
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
            if (!this.blockMovement) {
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
                                this.battle = new Battle(this.spawnPokemon(), this.player);
                                this.battle.loadBattleScreen();
                                this.battle.setText(`Wild ${this.battle.wildPokemon.name.toLocaleUpperCase()} appeared!`);

                                setTimeout(() => {
                                    this.battle!.setText(`Let's go ${this.battle!.playerPokemon!.name.toLocaleUpperCase()}!`);
                                }, 1000);

                                setTimeout(() => {
                                    this.showMenu = "battle";
                                    this.changeMenu();
                                }, 2000);
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

                if (this.showMenu == "battle") {
                    this.battleMenu(event);
                }

                else if (this.showMenu == "fight") {
                    this.fightMenu(event);
                }

                else if (this.showMenu == "pokemon") {
                    this.pokemonMenu(event);
                }

                else if (this.showMenu == "pokemon-options") {
                    this.pokemonMenuOpt(event);
                }

                else if (this.showMenu == "switch-pokemon") {
                    this.pokemonMenuSwitch(event);
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