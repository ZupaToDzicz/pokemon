import { Player } from "./player";
import { Pokemon } from "./pokemon";

export class Battle {
    wildPokemon: Pokemon;
    player: Player;
    
    constructor(pokemon: Pokemon, player: Player) {
        this.wildPokemon = pokemon;
        this.player = player;
    }
    
    loadBattleScreen() {
        const battleCont = document.getElementById('battle-cont')!;
        battleCont.style.display = "block";

        const wildPokemonImg = document.createElement("div");
        wildPokemonImg.id = "wild-pokemon-img";
        battleCont.append(wildPokemonImg);
        wildPokemonImg.style.backgroundImage = `url(./src/gfx/pokemon-front-1/${this.wildPokemon.name}.png)`

        const playerImg = document.createElement("div");
        playerImg.id = "player-img";
        battleCont.append(playerImg);
        playerImg.style.backgroundImage = `url(./src/gfx/pokemon-back/${this.player.pokemon[0].name}.png)`
    }
}