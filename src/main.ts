import { Player } from "./modules/player";
import { Location } from "./modules/location";
import { Game } from "./modules/game";
import { Pokemon } from "./modules/pokemon";

export const music = new Audio("src/sounds/title-screen.mp3");
music.loop = true;
music.play();

const titleScreen = document.createElement("div");
titleScreen.id = "title-screen";
document.body.append(titleScreen);

const nameLabel = document.createElement("div");
nameLabel.innerHTML = "What's Your name?";
titleScreen.append(nameLabel);

const input = document.createElement("input");
input.maxLength = 8;
titleScreen.append(input);
input.focus();

const startLabel = document.createElement("div");
startLabel.id = "start-label";
startLabel.innerHTML = "Press ENTER to begin Your adventure!";
titleScreen.append(startLabel);

const starterLabel = document.createElement("div");
starterLabel.innerHTML = "Choose Your starter POKéMON";
titleScreen.append(starterLabel);

const starterCont = document.createElement("div");
starterCont.id = "starter-cont";
titleScreen.append(starterCont);

const starters = ["bulbasaur", "squirtle", "charmander"];
let selected = "bulbasaur";

function changeStarter(name: string) {
    selected = name;
    const starterConts = [...document.getElementsByClassName("starter-img")];
    starterConts.forEach(starter => {
        if (starter.getAttribute("data-starter") == selected)
            starter.classList.add("starter-selected");
        else starter.classList.remove("starter-selected");
    });
}

starters.forEach(pokemon => {
    const starter = document.createElement("div");
    starter.classList.add("starter-img");
    starter.setAttribute("data-starter", pokemon);
    starter.style.backgroundImage = `url("src/gfx/pokemon-front-1/${pokemon}.png")`;
    starterCont.append(starter);
    if (pokemon == selected) starter.classList.add("starter-selected");
    starter.addEventListener("click", () => { changeStarter(pokemon) });
})

document.addEventListener("keydown", startGame);

function startGame(e: KeyboardEvent) {
    if (e.key == "Enter" && input.value.trim() != "") {
        document.removeEventListener("keydown", startGame);
        titleScreen.style.display = "none";
        const player = new Player(input.value, 16, 46);
        player.pokemon.push(new Pokemon(selected, 5));
        const city = new Location("viridian-forest");
        const game = new Game(player, city);
        game.start();
        game.spawnPokemon();
    }
}


// sprites
// https://www.spriters-resource.com/game_boy_gbc/pokemonredblue/

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
// https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_icons_in_Generations_I_and_II