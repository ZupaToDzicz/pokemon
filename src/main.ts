import { Player } from "./modules/player";
import { Location } from "./modules/location";
import { Game } from "./modules/game";
import { Pokemon } from "./modules/pokemon";

const player = new Player("Red", 16, 46);
const city = new Location("viridian-forest");
const game = new Game(player, city);
game.start();

const supcioBulbasaur = new Pokemon("bulbasaur", 5);
supcioBulbasaur.printStats();

const supcioCharmander = new Pokemon("charmander", 5);
supcioCharmander.printStats();

const supcioSquirtle = new Pokemon("squirtle", 5);
supcioSquirtle.printStats();

// useful
// https://pokemondb.net/pokedex/game/red-blue-yellow
// https://www.ign.com/wikis/pokemon-red-blue-yellow-version/Pokemon_Types
// https://www.ign.com/wikis/pokemon-red-blue-yellow-version/Stats_and_Hit_Points
// https://gamefaqs.gamespot.com/boards/367023-pokemon-red-version/51517002
// https://pycosites.com/pkmn/stat_gen1.php
// https://bulbapedia.bulbagarden.net/wiki/Damage
// https://bulbapedia.bulbagarden.net/wiki/Stat#HP
// https://bulbapedia.bulbagarden.net/wiki/Experience#Experience_gain_in_battle
// https://pokemondb.net/type
// https://strategywiki.org/wiki/Pok%C3%A9mon_Red_and_Blue/Moves
// https://www.dragonflycave.com/mechanics/gen-i-capturing#algorithm
// https://github.com/pcattori/pokemon/blob/master/pokemon/data/moves.json
// https://gist.github.com/agarie/2620966s