import { size } from "./interface";
import { Cords } from "./interface";
import { Pokemon } from "./pokemon";

export class Player {
    img: HTMLImageElement;
    cords: Cords;
    walkingFrame: number;
    name: string;
    pokemon: Pokemon[];
    cursor: number = 0;
    optionCursor: number = 0;
    switchCursor: number = 0;

    constructor(name: string, x?: number, y?: number) {
        this.name = name;
        this.img = new Image();
        this.img.src = "./src/gfx/player-sprite.png";
        this.cords = (x && y) ? { x: x, y: y } : { x: 0, y: 0 };
        this.walkingFrame = 1;
        this.pokemon = [new Pokemon("charmander", 1), new Pokemon("bulbasaur", 5)];

        this.pokemon.forEach(pkmn => { pkmn.isWild = false });
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

    renderPokemon(selected?: number) {
        this.cursor = selected ? selected : 0;
        this.optionCursor = 0;
        this.switchCursor = 0;
        const pokemonMenu = document.getElementById("pokemon-menu")!;
        pokemonMenu.innerHTML = "";

        const menuText = document.createElement("div");
        menuText.id = "menu-text";
        menuText.classList.add("menu-text");
        pokemonMenu.append(menuText);
        menuText.innerText = "Choose a POKéMON."

        const cursorCol = document.createElement("div");
        cursorCol.id = "cursor-col";
        pokemonMenu.append(cursorCol);

        this.pokemon.forEach((pkmn) => {
            const pokemonCont = document.createElement("div");
            pokemonCont.classList.add("pokemon-cont");
            pokemonMenu.append(pokemonCont)

            const img = new Image(64, 64);
            img.src = `src/gfx/pokemon-menu/pokemon-menu-${pkmn.menuIcon}.png`;
            pokemonCont.append(img);
            img.style.gridArea = "1 / 1 / 3 / 2";

            const name = document.createElement("div");
            name.innerText = pkmn.name.toLocaleUpperCase();
            pokemonCont.append(name);

            const level = document.createElement("div");
            level.innerHTML = `<img src="src/gfx/level.png">${pkmn.level}`;
            pokemonCont.append(level);

            const HPBar = new Image();
            HPBar.src = "src/gfx/hp-bar.png";
            pokemonCont.append(HPBar);

            const HP = document.createElement("div");
            HP.innerText = `${pkmn.HP}/${pkmn.max.HP}`;
            HP.style.justifyContent = "center";
            pokemonCont.append(HP);
        })

        const pokemonOptions = document.createElement("div");
        pokemonOptions.id = "pokemon-options";
        pokemonMenu.append(pokemonOptions);

        const cursorColOpt = document.createElement("div");
        cursorColOpt.id = "cursor-col-opt";
        pokemonOptions.append(cursorColOpt);
    }

    switchPokemon(p1: number, p2: number) {
        if (p1 == p2) return;
        [this.pokemon[p1], this.pokemon[p2]] = [this.pokemon[p2], this.pokemon[p1]];
    }

    hasAlivePokemon() {
        if (this.pokemon.some(pkmn => { return pkmn.isAlive() }))
            return true;
        return false;
    }
}