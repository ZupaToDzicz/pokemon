import { Player } from "./player";
import { Pokemon } from "./pokemon";


export class Battle {
    wildPokemon: Pokemon;
    player: Player;
    playerPokemon: (Pokemon | undefined);
    mainMenu: string[] = ["fight", "pokemon", "item", "run"];
    cursor: number = 0;
    selectedOption: (string | undefined) = undefined;
    
    constructor(pokemon: Pokemon, player: Player) {
        this.wildPokemon = pokemon;
        this.player = player;
        this.playerPokemon = undefined;

        let i = 0;
        while (this.playerPokemon == undefined && i < this.player.pokemon.length) {
            if (this.player.pokemon[i].isAlive()) this.playerPokemon = this.player.pokemon[i];
            i++;
        }
    }
    
    loadBattleScreen() {
        const battleCont = document.getElementById('battle-cont')!;
        battleCont.style.display = "block";
        battleCont.innerHTML = "";

        const battleMenu = document.createElement("div");
        battleMenu.id = "battle-menu";
        battleCont.append(battleMenu);

        const battleText = document.createElement("div");
        battleText.id = "battle-text";
        battleText.classList.add("menu-text");
        battleCont.append(battleText);
        battleText.innerText = "";

        const fightMenu = document.createElement("div");
        fightMenu.id = "fight-menu";
        battleCont.append(fightMenu);

        const wildPokemonImg = document.createElement("div");
        wildPokemonImg.id = "wild-pokemon-img";
        battleCont.append(wildPokemonImg);
        wildPokemonImg.style.backgroundImage = `url(./src/gfx/pokemon-front-1/${this.wildPokemon.name}.png)`;

        const playerImg = document.createElement("div");
        playerImg.id = "player-img";
        battleCont.append(playerImg);
        playerImg.style.backgroundImage = `url(./src/gfx/pokemon-back/${this.playerPokemon!.name}.png)`;

        const wildPokemonName = document.createElement("div");
        wildPokemonName.id = "wild-pokemon-name";
        wildPokemonName.classList.add("pokemon-name");
        wildPokemonName.innerText = this.wildPokemon.name;
        battleCont.append(wildPokemonName);

        const wildPokemonLevel = document.createElement("div");
        wildPokemonLevel.id = "wild-pokemon-level";
        wildPokemonLevel.classList.add("pokemon-level");
        wildPokemonLevel.innerHTML = `<img src="src/gfx/level.png">${this.wildPokemon.level}`;
        battleCont.append(wildPokemonLevel);

        const playerPokemonName = document.createElement("div");
        playerPokemonName.id = "player-pokemon-name";
        playerPokemonName.classList.add("pokemon-name");
        playerPokemonName.innerText = this.playerPokemon!.name;
        battleCont.append(playerPokemonName);

        const playerPokemonLevel = document.createElement("div");
        playerPokemonLevel.id = "player-pokemon-level";
        playerPokemonLevel.classList.add("pokemon-level");
        playerPokemonLevel.innerHTML = `<img src="src/gfx/level.png">${this.playerPokemon!.level}`;
        battleCont.append(playerPokemonLevel);

        const HPCont = document.createElement("div");
        HPCont.id = "hp-cont";
        HPCont.classList.add("pokemon-level");
        HPCont.innerText = `${this.playerPokemon!.HP}`
        battleCont.append(HPCont);

        const maxHPCont = document.createElement("div");
        maxHPCont.id = "max-hp-cont";
        maxHPCont.classList.add("pokemon-level");
        maxHPCont.innerText = `${this.playerPokemon!.maxHP}`
        battleCont.append(maxHPCont);
    }

    setText(text: string) {
        const battleText = document.getElementById("battle-text")!;
        battleText.innerText = text;
    }

    clearText() {
        const battleText = document.getElementById("battle-text")!;
        battleText.innerText = "";
    }
}