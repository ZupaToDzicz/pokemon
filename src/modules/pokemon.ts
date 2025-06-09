import pokemonData from '../data/pokemon.json'
import movesDataJSON from '../data/moves.json'
import typesData from '../data/types.json'
import stagesData from '../data/stages.json'
import levelsData from '../data/levels.json'

const data: { [key: string]: any } = pokemonData;
const movesData: { [key: string]: any } = movesDataJSON;
const types: { [key: string]: { [key: string]: number } } = typesData;
const stages: { [key: string]: number } = stagesData;
const levels: { [key: string]: number } = levelsData;

export class Pokemon {
    name: string;
    level: number;
    menuIcon: number;
    type1: string;
    type2?: string;
    iv: { [key: string]: number };
    isWild: boolean = true;
    catchRate: number;
    baseExp: number;
    exp: number;
    pokedex: number;

    HP: number;
    attack: number;
    defense: number;
    speed: number;
    special: number;

    max: { [key: string]: number };

    moves: { name: string, pp: number }[];

    stages: { [key: string]: number } = {
        "HP": 0,
        "attack": 0,
        "defense": 0,
        "speed": 0,
        "special": 0
    }

    constructor(name: string, level: number) {
        this.name = name;
        this.level = level;
        this.menuIcon = data[name].menuIcon;

        this.type1 = data[name].type1;
        if (data[name].type2) this.type2 = data[name].type2;
        this.catchRate = data[name].catchRate;
        this.baseExp = data[name].base.exp;
        this.exp = levels[level.toString()];
        this.pokedex = data[name].id;

        this.iv = {
            "HP": Math.floor(Math.random() * 16),
            "attack": Math.floor(Math.random() * 16),
            "defense": Math.floor(Math.random() * 16),
            "speed": Math.floor(Math.random() * 16),
            "special": Math.floor(Math.random() * 16)
        }

        this.HP = Math.ceil((2 * data[name].base.HP + 2 * this.iv.HP) * (level / 100) + level + 10);
        this.attack = Math.ceil((2 * data[name].base.attack + 2 * this.iv.attack) * (level / 100) + 5);
        this.defense = Math.ceil((2 * data[name].base.defense + 2 * this.iv.defense) * (level / 100) + 5);
        this.speed = Math.ceil((2 * data[name].base.speed + 2 * this.iv.speed) * (level / 100) + 5);
        this.special = Math.ceil((2 * data[name].base.special + 2 * this.iv.special) * (level / 100) + 5);

        this.max = {
            "HP": this.HP,
            "attack": this.attack,
            "defense": this.defense,
            "speed": this.speed,
            "special": this.special
        }

        this.moves = [];
        data[name].moves.forEach((move: { name: string, level: number; }) => {
            if (move.level <= level) {
                this.moves.push({ name: move.name, pp: movesData[move.name].pp });
            }
        });
    }

    printStats() {
        console.log(`name: ${this.name}
level: ${this.level}
type: ${this.type1} ${this.type2 ? "/ " + this.type2 : ""}
HP: ${this.HP}/${this.max.HP}
attack: ${this.attack}/${this.max.attack}
defense: ${this.defense}/${this.max.defense}
speed: ${this.speed}/${this.max.speed}
special: ${this.special}/${this.max.special}
moves: ${JSON.stringify(this.moves)}`)
    }

    recoverStats() {
        this.attack = this.max.attack;
        this.defense = this.max.defense;
        this.speed = this.max.speed;
        this.special = this.max.special;

        this.stages = {
            "HP": 0,
            "attack": 0,
            "defense": 0,
            "speed": 0,
            "special": 0
        }
    }

    recoverHP() {
        this.HP = this.max.HP;
    }

    recoverPP() {
        this.moves.forEach(move => {
            move.pp = movesData[move.name].pp
        })
    }

    levelUp() {
        this.level += 1;

        const currentHP = Math.ceil(this.HP / this.max.HP);
        this.max.HP = Math.ceil((2 * data[this.name].base.HP + 2 * this.iv.HP) * (this.level / 100) + this.level + 10);
        this.HP = Math.ceil(this.max.HP * currentHP);

        this.max.attack = Math.ceil((2 * data[this.name].base.attack + 2 * this.iv.attack) * (this.level / 100) + 5);
        this.max.defense = Math.ceil((2 * data[this.name].base.defense + 2 * this.iv.defense) * (this.level / 100) + 5);
        this.max.speed = Math.ceil((2 * data[this.name].base.speed + 2 * this.iv.speed) * (this.level / 100) + 5);
        this.max.special = Math.ceil((2 * data[this.name].base.special + 2 * this.iv.special) * (this.level / 100) + 5);

        data[this.name].moves.forEach((move: { name: string, level: number; }) => {
            if (move.level <= this.level && this.moves.every(e => { return e.name != move.name })) {
                this.moves.push({ name: move.name, pp: movesData[move.name].pp });
            }
        });

        this.recoverStats();
    }

    recoverAll() {
        this.recoverStats();
        this.recoverHP();
        this.recoverPP();
    }

    isAlive() {
        if (this.HP > 0) return true;
        else return false;
    }

    attackPokemon(target: Pokemon, moveName: string): string {
        const move = movesData[moveName];

        if (Math.random() > move.accuracy) {
            return `${this.isWild ? "Enemy " : ""}${this.name.toLocaleUpperCase()}'s \nattack missed!`;
        }

        if (move.category == "physical" || move.category == "special") {
            let A = this.attack;
            let D = target.defense;
            if (move.category == "special") {
                A = this.special;
                D = target.special;
            }

            if (A > 255 || D > 255) {
                A = Math.floor(A / 4);
                D = Math.floor(D / 4);
            }
            if (D == 0) D = 1;

            let STAB = 1;
            if (this.type1 == move.type || (this.type2 && this.type2 == move.type))
                STAB = 1.5;

            let type1 = types[move.type][target.type1];
            let type2 = target.type2 ? types[move.type][target.type2] : 1;

            let random = Math.floor(Math.random() * (256 - 217) + 217) / 255;

            const damage = Math.floor((((((2 * this.level) / 5) + 2) * move.power * (A / D)) / 50 + 2) * STAB * type1 * type2 * random);

            console.log("Damage: ", damage);

            if (damage == 0) {
                return `${this.isWild ? "Enemy " : ""}${this.name.toLocaleUpperCase()}'s \nattack missed!`;
            }

            if (target.HP - damage < 0) {
                target.HP = 0;
            }
            else {
                target.HP -= damage;
            }

            if (type1 == 2 || (type2 && type2 == 2))
                return "It's super \neffective!";
            else if (type1 == 0.5 || (type2 && type2 == 0.5))
                return "It's not very \neffective...";
            return "";
        }

        else if (move.category == "status") {
            type Stat = "HP" | "attack" | "defense" | "speed" | "special";

            if (move.effect.stages) {
                const stat: Stat = move.effect.stat;
                if (target.stages[stat] > -6) {
                    target.stages[stat] += move.effect.stages;
                    target[stat] = Math.ceil(stages[target.stages[stat]] * target.max[stat]);

                    return `${target.isWild ? "Enemy " : ""}${target.name.toLocaleUpperCase()}'s \n${stat.toLocaleUpperCase()} fell!`;
                }

                else {
                    return `Nothing happened!`;
                }
            }

            else if (move.effect.target) {
                const stat: Stat = move.effect.stat;
                target[stat] += eval(move.effect.target);

                if (move.effect.self) {
                    if (stat == "HP") {
                        if (this.HP + eval(move.effect.self) > this.max.HP)
                            this.HP = this.max.HP;
                        else this.HP += eval(move.effect.self);
                        return "self";
                    }
                    else {
                        this[stat] += eval(move.effect.self);
                        return `${this.name.toLocaleUpperCase()}'s \n${stat.toLocaleUpperCase()} rose!`
                    }
                }
            }

            else if (move.effect.self) {
                const stat: Stat = move.effect.stat;
                if (this.stages[stat] < 6) {
                    this.stages[stat] += move.effect.stages;
                    this[stat] = Math.ceil(stages[this.stages[stat]] * this.max[stat]);

                    return `${this.name.toLocaleUpperCase()}'s \n${stat.toLocaleUpperCase()} rose!`;
                }

                else {
                    return `Nothing happened!`;
                }
            }

            return "";
        }

        return "";
    }

    calcHPFactor(): number {
        let f = Math.floor((this.max.HP * 255) / 12);
        let f2 = Math.floor(this.HP / 4);
        if (f2 == 0) f2 = 1;
        f = Math.floor(f / f2);
        if (f > 255) f = 255;

        return f;
    }

    renderStats() {
        const statScreen = document.getElementById("stat-screen")!;
        statScreen.innerHTML = "";

        const statImage = document.createElement("div");
        statImage.id = "stat-img";
        statImage.style.backgroundImage = `url('src/gfx/pokemon-front-1/${this.name}.png')`;
        statScreen.append(statImage);

        const number = document.createElement("div");
        number.innerText = this.pokedex.toString().padStart(3, "0");
        number.id = "stat-number";
        statScreen.append(number);

        const statName = document.createElement("div");
        statName.innerText = this.name.toLocaleUpperCase();
        statName.id = "stat-name";
        statScreen.append(statName);

        const statLevel = document.createElement("div");
        statLevel.innerText = this.level.toString();
        statLevel.id = "stat-level";
        statScreen.append(statLevel);

        const statAttack = document.createElement("div");
        statAttack.classList.add("stat-item");
        statAttack.innerText = this.max.attack.toString();
        statAttack.style.top = "352px";
        statScreen.append(statAttack);

        const statDefense = document.createElement("div");
        statDefense.classList.add("stat-item");
        statDefense.innerText = this.max.defense.toString();
        statDefense.style.top = "416px";
        statScreen.append(statDefense);

        const statSpeed = document.createElement("div");
        statSpeed.classList.add("stat-item");
        statSpeed.innerText = this.max.speed.toString();
        statSpeed.style.top = "480px";
        statScreen.append(statSpeed);

        const statSpecial = document.createElement("div");
        statSpecial.classList.add("stat-item");
        statSpecial.innerText = this.max.special.toString();
        statSpecial.style.top = "544px";
        statScreen.append(statSpecial);

        const HPBarCont = document.createElement("div");
        HPBarCont.classList.add("hp-bar-cont");
        statScreen.append(HPBarCont);
        HPBarCont.style.top = "128px";
        HPBarCont.style.left = "320px";

        let HPColor = "#48a058", HPPercent;
        HPPercent = this.HP / this.max.HP;
        if (HPPercent <= 0.25) HPColor = "#c33b25";
        else if (HPPercent <= 0.5) HPColor = "#c49009";

        const HPBar = document.createElement("div");
        HPBar.classList.add("hp-bar");
        HPBar.style.width = `${Math.round(HPPercent * 192)}px`;
        HPBar.style.background = HPColor;
        HPBarCont.append(HPBar);

        const statHP = document.createElement("div");
        statHP.innerText = `${this.HP}/${this.max.HP}`;
        statHP.id = "stat-hp";
        statScreen.append(statHP);

        const statStatus = document.createElement("div");
        statStatus.id = "stat-status";
        statStatus.innerText = this.isAlive() ? "OK" : "FNT";
        statScreen.append(statStatus);

        const statType1Label = document.createElement("div");
        statType1Label.innerText = "TYPE1/";
        statType1Label.classList.add("stat-type-label");
        statType1Label.style.top = "320px"
        statScreen.append(statType1Label);

        const statType1 = document.createElement("div");
        statType1.innerText = this.type1.toLocaleUpperCase();
        statType1.classList.add("stat-type");
        statType1.style.top = "352px"
        statScreen.append(statType1);

        if (this.type2) {
            const statType2Label = document.createElement("div");
            statType2Label.innerText = "TYPE2/";
            statType2Label.classList.add("stat-type-label");
            statType2Label.style.top = "384px"
            statScreen.append(statType2Label);

            const statType2 = document.createElement("div");
            statType2.innerText = this.type2!.toLocaleUpperCase();
            statType2.classList.add("stat-type");
            statType2.style.top = "416px"
            statScreen.append(statType2);
        }
    }
}


// calculating stats - without effort
// For most stats: ( 2(base) + 2(genes) + (effort) ) * (level/100) + 5
// For HP: ( 2(base) + 2(genes) + (effort) ) * (level/100) + level + 10