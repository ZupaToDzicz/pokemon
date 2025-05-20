import pokemonData from '../data/pokemon.json'
import movesDataJSON from '../data/moves.json'

const data: { [key: string]: any } = pokemonData;
const movesData: { [key: string]: any } = movesDataJSON;

export class Pokemon {
    name: string;
    level: number;
    type1: string;
    type2?: string;
    iv: { [key: string]: number };

    HP: number;
    attack: number;
    defense: number;
    speed: number;
    special: number;

    maxHP: number;
    maxAttack: number;
    maxDefense: number;
    maxSpeed: number;
    maxSpecial: number;

    moves: { name: string, pp: number }[];

    constructor(name: string, level: number) {
        this.name = name;
        this.level = level;

        this.type1 = data[name].type1;
        if (data[name].type2) this.type2 = data[name].type2;

        this.iv = {
            "HP": Math.floor(Math.random() * 16),
            "attack": Math.floor(Math.random() * 16),
            "defense": Math.floor(Math.random() * 16),
            "speed": Math.floor(Math.random() * 16),
            "special": Math.floor(Math.random() * 16)
        }

        this.HP = Math.ceil((2 * data[name].base.HP + 2 * this.iv.HP) * (level / 100) + level + 10);
        this.maxHP = this.HP;

        this.attack = Math.ceil((2 * data[name].base.attack + 2 * this.iv.attack) * (level / 100) + 5);
        this.maxAttack = this.attack;
        this.defense = Math.ceil((2 * data[name].base.defense + 2 * this.iv.defense) * (level / 100) + 5);
        this.maxDefense = this.defense;
        this.speed = Math.ceil((2 * data[name].base.speed + 2 * this.iv.speed) * (level / 100) + 5);
        this.maxSpeed = this.speed;
        this.special = Math.ceil((2 * data[name].base.special + 2 * this.iv.special) * (level / 100) + 5);
        this.maxSpecial = this.special;

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
HP: ${this.HP}/${this.maxHP}
attack: ${this.attack}
defense: ${this.defense}
speed: ${this.speed}
special: ${this.special}
moves: ${JSON.stringify(this.moves)}`)
    }

    recoverStats() {
        this.attack = this.maxAttack;
        this.defense = this.maxDefense;
        this.speed = this.maxSpeed;
        this.special = this.maxSpecial;
    }

    recoverHP() {
        this.HP = this.maxHP;
    }

    recoverPP() {
        this.moves.forEach(move => {
            move.pp = movesData[move.name].pp
        })
    }

    levelUp() {
        this.level += 1;

        const currentHP = Math.ceil(this.HP / this.maxHP);
        this.maxHP = Math.ceil((2 * data[this.name].base.HP + 2 * this.iv.HP) * (this.level / 100) + this.level + 10);
        this.HP = Math.ceil(this.maxHP * currentHP);

        this.maxAttack = Math.ceil((2 * data[this.name].base.attack + 2 * this.iv.attack) * (this.level / 100) + 5);
        this.maxDefense = Math.ceil((2 * data[this.name].base.defense + 2 * this.iv.defense) * (this.level / 100) + 5);
        this.maxSpeed = Math.ceil((2 * data[this.name].base.speed + 2 * this.iv.speed) * (this.level / 100) + 5);
        this.maxSpecial = Math.ceil((2 * data[this.name].base.special + 2 * this.iv.special) * (this.level / 100) + 5);

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
}


// calculating stats - without effort
// For most stats: ( 2(base) + 2(genes) + (effort) ) * (level/100) + 5
// For HP: ( 2(base) + 2(genes) + (effort) ) * (level/100) + level + 10