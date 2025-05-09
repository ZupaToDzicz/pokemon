import { Player } from "./modules/player";
import { Location } from "./modules/location";
import { Game } from "./modules/game";

const player = new Player("Red", 16, 46);
const city = new Location("viridian-forest");
const game = new Game(player, city);
game.start();