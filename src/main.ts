import { Player } from "./modules/player";
import { Location } from "./modules/location";
import { Game } from "./modules/game";
import { Pokemon } from "./modules/pokemon";

export const music = new Audio("src/sounds/title-screen.mp3");
music.loop = true;
music.play();

export const sound = new Audio();

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
    starter.style.backgroundImage = `url("src/gfx/starters/${pokemon}.png")`;
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