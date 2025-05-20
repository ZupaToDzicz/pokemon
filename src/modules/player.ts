import { size } from "./interface";
import { Cords } from "./interface";
import { Pokemon } from "./pokemon";

export class Player {
    img: HTMLImageElement;
    cords: Cords;
    walkingFrame: number;
    name: string;
    pokemon: Pokemon[];

    constructor(name: string, x?: number, y?: number) {
        this.name = name;
        this.img = new Image();
        this.img.src = "./src/gfx/player-sprite.png";
        this.cords = (x && y) ? { x: x, y: y } : { x: 0, y: 0 };
        this.walkingFrame = 1;
        this.pokemon = [new Pokemon("bulbasaur", 5), new Pokemon("charmander", 6)];
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

    showPokemon() {
        const pokemonMenu = document.getElementById("pokemon-menu")!;
        pokemonMenu.innerHTML = "";

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
            HP.innerText = `${pkmn.HP}/${pkmn.maxHP}`;
            HP.style.justifyContent = "center";
            pokemonCont.append(HP);
        })
    }
}