import { size } from "./interface";
import { Cords } from "./interface";
import { Pokemon } from "./pokemon";

export class Player {
    img: HTMLImageElement;
    cords: Cords;
    walkingFrame: number;
    name: string;
    pokemon: Pokemon[];
    menuCursor: number = 0;

    constructor(name: string, x?: number, y?: number) {
        this.name = name;
        this.img = new Image();
        this.img.src = "./src/gfx/player-sprite.png";
        this.cords = (x && y) ? { x: x, y: y } : { x: 0, y: 0 };
        this.walkingFrame = 1;
        this.pokemon = [new Pokemon("charmander", 5), new Pokemon("caterpie", 69), new Pokemon("squirtle", 420), new Pokemon("bulbasaur", 66), new Pokemon("charmander", 1), new Pokemon("charmander", 51)];
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

    renderPokemon() {
        this.menuCursor = 0;
        const pokemonMenu = document.getElementById("pokemon-menu")!;
        pokemonMenu.innerHTML = "";

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
            HP.innerText = `${pkmn.HP}/${pkmn.maxHP}`;
            HP.style.justifyContent = "center";
            pokemonCont.append(HP);
        })
    }

    pokemonMenuControl(e: KeyboardEvent) {
        document.getElementById("cursor-col")!.innerHTML = '';
        const cursorCont = document.createElement("div");
        cursorCont.classList.add("cursor");
        document.getElementById("cursor-col")!.append(cursorCont);

        if (e.key.toLowerCase() === "s" && this.menuCursor + 1 < this.pokemon.length) {
            this.menuCursor += 1;
        }
        else if (e.key.toLowerCase() === "w" && this.menuCursor - 1 >= 0) {
            this.menuCursor -= 1;
        }
        cursorCont.style.top = `${64 + 64 * this.menuCursor}px`;
        console.log(this.menuCursor);
    }
}