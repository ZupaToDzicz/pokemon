import { Player } from "./player";
import { Pokemon } from "./pokemon";

const delay: number = 2000;

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
        playerImg.style.backgroundImage = `url(./src/gfx/player-back.png)`;

        const animationCloud = document.createElement("div");
        animationCloud.id = "animation-cloud";
        battleCont.append(animationCloud);

        const wildInterface = document.createElement("div");
        wildInterface.id = "wild-pokemon-interface";
        battleCont.append(wildInterface);
        wildInterface.style.display = "none";

        const playerInterface = document.createElement("div");
        playerInterface.id = "player-pokemon-interface";
        battleCont.append(playerInterface);
        playerInterface.style.display = "none";
    }

    updateBattleScreen() {
        const wildInterface = document.getElementById("wild-pokemon-interface")!;
        wildInterface.innerHTML = "";
        wildInterface.style.display = "block";

        const playerInterface = document.getElementById("player-pokemon-interface")!;
        playerInterface.innerHTML = "";
        playerInterface.style.display = "block";

        const playerImg = document.getElementById("player-img")!;
        playerImg.style.backgroundImage = `url(./src/gfx/pokemon-back/${this.playerPokemon!.name}.png)`;

        const wildPokemonName = document.createElement("div");
        wildPokemonName.id = "wild-pokemon-name";
        wildPokemonName.classList.add("pokemon-name");
        wildPokemonName.innerText = this.wildPokemon.name;
        wildInterface.append(wildPokemonName);

        const wildPokemonLevel = document.createElement("div");
        wildPokemonLevel.id = "wild-pokemon-level";
        wildPokemonLevel.classList.add("pokemon-level");
        wildPokemonLevel.innerHTML = `<img src="src/gfx/level.png">${this.wildPokemon.level}`;
        wildInterface.append(wildPokemonLevel);

        const wildPokemonHPBar = document.createElement("div");
        wildPokemonHPBar.id = "wild-pokemon-hp-bar";
        wildPokemonHPBar.classList.add("hp-bar-cont");
        wildPokemonHPBar.classList.add("fight-hp-bar");
        wildInterface.append(wildPokemonHPBar);

        const wildPokemonHP = document.createElement("div");
        wildPokemonHP.id = "wild-pokemon-hp";
        wildPokemonHP.classList.add("hp-bar");
        const wildHPPercent = this.wildPokemon.HP / this.wildPokemon.max.HP;
        wildPokemonHP.style.width = `${Math.round(wildHPPercent * 192)}px`;
        if (wildHPPercent <= 0.25)
            wildPokemonHP.style.background = "#c33b25";
        else if (wildHPPercent <= 0.5)
            wildPokemonHP.style.background = "#c49009";
        wildPokemonHPBar.append(wildPokemonHP);

        const playerPokemonName = document.createElement("div");
        playerPokemonName.id = "player-pokemon-name";
        playerPokemonName.classList.add("pokemon-name");
        playerPokemonName.innerText = this.playerPokemon!.name;
        playerInterface.append(playerPokemonName);

        const playerPokemonLevel = document.createElement("div");
        playerPokemonLevel.id = "player-pokemon-level";
        playerPokemonLevel.classList.add("pokemon-level");
        playerPokemonLevel.innerHTML = `<img src="src/gfx/level.png">${this.playerPokemon!.level}`;
        playerInterface.append(playerPokemonLevel);

        const playerPokemonHPBar = document.createElement("div");
        playerPokemonHPBar.id = "player-pokemon-hp-bar";
        playerPokemonHPBar.classList.add("hp-bar-cont");
        playerPokemonHPBar.classList.add("fight-hp-bar");
        playerInterface.append(playerPokemonHPBar);

        const playerPokemonHP = document.createElement("div");
        playerPokemonHP.id = "player-pokemon-hp";
        playerPokemonHP.classList.add("hp-bar");
        const playerHPPercent = this.playerPokemon!.HP / this.playerPokemon!.max.HP;
        playerPokemonHP.style.width = `${Math.round(playerHPPercent * 192)}px`;
        if (playerHPPercent <= 0.25)
            playerPokemonHP.style.background = "#c33b25";
        else if (playerHPPercent <= 0.5)
            playerPokemonHP.style.background = "#c49009";
        playerPokemonHPBar.append(playerPokemonHP);

        const HPCont = document.createElement("div");
        HPCont.id = "hp-cont";
        HPCont.classList.add("pokemon-level");
        HPCont.innerText = `${this.playerPokemon!.HP}`;
        playerInterface.append(HPCont);

        const maxHPCont = document.createElement("div");
        maxHPCont.id = "max-hp-cont";
        maxHPCont.classList.add("pokemon-level");
        maxHPCont.innerText = `${this.playerPokemon!.max.HP}`;
        playerInterface.append(maxHPCont);
    }

    setText(text: string) {
        const battleText = document.getElementById("battle-text")!;
        battleText.innerText = text;
    }

    clearText() {
        const battleText = document.getElementById("battle-text")!;
        battleText.innerText = "";
    }

    async showInfo(info: string) {
        if (info != "") {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    this.setText(info);
                    resolve()
                }, delay);
            })
        }
    }

    dropHPAnim(wildPokemon: boolean) {
        let HPColor = "#48a058", HPPercent;
        if (wildPokemon) {
            HPPercent = this.wildPokemon.HP / this.wildPokemon.max.HP;
            if (HPPercent <= 0.25) HPColor = "#c33b25";
            else if (HPPercent <= 0.5) HPColor = "#c49009";

            document.getElementById("wild-pokemon-hp")?.animate({ width: `${Math.round(HPPercent * 192)}px`, background: HPColor }, { duration: 1000, fill: "forwards" });
        }

        else {
            HPPercent = this.playerPokemon!.HP / this.playerPokemon!.max.HP;
            if (HPPercent <= 0.25) HPColor = "#c33b25";
            else if (HPPercent <= 0.5) HPColor = "#c49009";

            document.getElementById("player-pokemon-hp")?.animate({ width: `${Math.round(HPPercent * 192)}px`, background: HPColor }, { duration: 1000, fill: "forwards" });

            const HPCont = document.getElementById("hp-cont")!;
            let prevHP = Number(HPCont.innerText);
            let diff = prevHP - this.playerPokemon!.HP;
            console.log(HPCont, prevHP, diff, this.playerPokemon!.HP);

            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    setTimeout(() => {
                        prevHP -= 1;
                        HPCont.innerText = prevHP.toString();
                    }, i * (1000 / diff));
                }
            }
        }
    }

    fight() {
        let playerMove = this.playerPokemon!.moves[this.cursor];
        let wildMove = this.wildPokemon.moves[Math.floor(Math.random() * this.wildPokemon.moves.length)];
        let attackInfo: string = "";

        return new Promise<void>(async (resolve, reject) => {
            if (this.playerPokemon!.speed >= this.wildPokemon.speed) {
                this.setText(`${this.playerPokemon!.name.toLocaleUpperCase()} used ${playerMove.name.toLocaleUpperCase()}!`);
                attackInfo = this.playerPokemon!.attackPokemon(this.wildPokemon, playerMove.name);
                playerMove.pp -= 1;
                this.dropHPAnim(true);

                await this.showInfo(attackInfo);
                setTimeout(async () => {
                    if (this.wildPokemon.isAlive()) {
                        this.setText(`Enemy ${this.wildPokemon.name.toLocaleUpperCase()} \nused ${wildMove.name.toLocaleUpperCase()}!`);
                        attackInfo = this.wildPokemon.attackPokemon(this.playerPokemon!, wildMove.name);
                        this.dropHPAnim(false);

                        await this.showInfo(attackInfo);
                        setTimeout(() => {
                            if (this.playerPokemon!.isAlive()) resolve();
                            else {
                                this.setText(`${this.playerPokemon!.name.toLocaleUpperCase()} \nfainted!`);

                                setTimeout(() => {
                                    reject();
                                }, delay);
                            }
                        }, delay);
                    }

                    else {
                        this.setText(`Enemy ${this.wildPokemon.name.toLocaleUpperCase()} \nfainted!`);

                        setTimeout(() => {
                            reject();
                        }, delay);
                    }

                }, delay);
            }

            else {
                this.setText(`Enemy ${this.wildPokemon.name.toLocaleUpperCase()} \nused ${wildMove.name.toLocaleUpperCase()}!`);
                attackInfo = this.wildPokemon.attackPokemon(this.playerPokemon!, wildMove.name);
                this.dropHPAnim(false);

                await this.showInfo(attackInfo);
                setTimeout(async () => {
                    if (this.playerPokemon!.isAlive()) {
                        this.setText(`${this.playerPokemon!.name.toLocaleUpperCase()} \nused ${playerMove.name.toLocaleUpperCase()}!`);
                        attackInfo = this.playerPokemon!.attackPokemon(this.wildPokemon, playerMove.name);
                        playerMove.pp -= 1;
                        this.dropHPAnim(true);

                        await this.showInfo(attackInfo);
                        setTimeout(() => {
                            if (this.wildPokemon.isAlive()) resolve();
                            else {
                                this.setText(`Enemy ${this.wildPokemon.name.toLocaleUpperCase()} \nfainted!`);

                                setTimeout(() => {
                                    reject();
                                }, delay);
                            }
                        }, delay);
                    }

                    else {
                        this.setText(`${this.playerPokemon!.name.toLocaleUpperCase()} \nfainted!`);

                        setTimeout(() => {
                            reject();
                        }, delay);
                    }
                }, delay);
            }
        })
    }
}