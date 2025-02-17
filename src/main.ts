const sx: number = Number(getComputedStyle(document.documentElement).getPropertyValue("--x"));
const sy: number = Number(getComputedStyle(document.documentElement).getPropertyValue("--y"));
const size: number = Number(getComputedStyle(document.documentElement).getPropertyValue("--size"));

interface Cords {
  x: number;
  y: number;
}

class Game {
  blockMovement: boolean = false;
  player: Player;
  location: Location;

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

    pfCont.append(playerCont);
    cont.append(pfCont);
    document.body.append(cont);
    this.render();
    this.initControls();
  }

  render() {
    this.player.img.onload = () => { this.player.renderPlayer(1) };
    this.location.img.onload = () => { this.location.renderLocation(this.player.cords.x, this.player.cords.y) };
  }

  setLocation(location: Location) {
    this.location = location;
    this.location.img.onload = () => { this.location.renderLocation(this.player.cords.x, this.player.cords.y) };
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
    this.player.cords.y -= 1;
    this.location.renderLocation(this.player.cords.x, this.player.cords.y);
    this.blockMovement = true;
    new Promise((resolve) => {
      setTimeout(() => {
        this.player.renderPlayer(playerFrames["back"]);
      }, 150);
      setTimeout(() => {
        this.blockMovement = false;
        resolve;
      }, 300);
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
    this.player.cords.y += 1;
    this.location.renderLocation(this.player.cords.x, this.player.cords.y);
    this.blockMovement = true;
    new Promise((resolve) => {
      setTimeout(() => {
        this.player.renderPlayer(playerFrames["front"]);
      }, 150);
      setTimeout(() => {
        this.blockMovement = false;
        resolve;
      }, 300);
    });
  }

  moveLeft() {
    this.player.renderPlayer(playerFrames["left-walk"]);
    this.player.cords.x -= 1;
    this.location.renderLocation(this.player.cords.x, this.player.cords.y);
    this.blockMovement = true;
    new Promise((resolve) => {
      setTimeout(() => {
        this.player.renderPlayer(playerFrames["left"]);
      }, 150);
      setTimeout(() => {
        this.blockMovement = false;
        resolve;
      }, 300);
    });
  }

  moveRight() {
    this.player.renderPlayer(playerFrames["right-walk"]);
    this.player.cords.x += 1;
    this.location.renderLocation(this.player.cords.x, this.player.cords.y);
    this.blockMovement = true;
    new Promise((resolve) => {
      setTimeout(() => {
        this.player.renderPlayer(playerFrames["right"]);
      }, 150);
      setTimeout(() => {
        this.blockMovement = false;
        resolve;
      }, 300);
    });
  }

  initControls() {
    document.body.addEventListener("keydown", async (event) => {
      if (!this.blockMovement) {
        if (event.key === "w") {
          this.moveBack();
        }
        else if (event.key === "s") {
          this.moveFront();
        }
        else if (event.key === "a") {
          this.moveLeft();
        }
        else if (event.key === "d") {
          this.moveRight();
        }
        console.log(this.player.cords.x, this.player.cords.y);
      }
    });
  }
}

const playerFrames = {
  "front-walk-1": 0,
  "front": 1,
  "front-walk-2": 2,
  "back-walk-1": 3,
  "back": 4,
  "back-walk-2": 5,
  "left": 6,
  "left-walk": 7,
  "right": 8,
  "right-walk": 9
}

class Player {
  img: HTMLImageElement;
  cords: Cords;
  walkingFrame: number;

  constructor(x: number, y: number) {
    this.img = new Image();
    this.img.src = "./src/gfx/player-sprite.png";
    this.cords = {x: x, y: y};
    this.walkingFrame = 1;
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
}

class Location {
  name: string;
  img: HTMLImageElement;
  blockedCords: Cords[];

  constructor(name: string) {
    this.name = name;
    this.img = new Image();
    this.img.src = `./src/gfx/${this.name}.png`;
    this.blockedCords = [];
  }

  renderLocation(x: number, y: number) {
    const pfCanvas = document.createElement("canvas");
    pfCanvas.width = sx * size;
    pfCanvas.height = sy * size;
    const ctx = pfCanvas.getContext("2d");

    ctx!.drawImage(this.img, x * size - 4 * size, y * size - 4 * size, sx * size, sy * size, 0, 0, size * sx, size * sy);
    const url = pfCanvas.toDataURL();
    document.getElementById("pf")!.style.backgroundImage = `url("${url}")`;
  }
}

const player = new Player(0, 0);
const city = new Location("viridian-forest");
const game = new Game(player, city);
game.start();