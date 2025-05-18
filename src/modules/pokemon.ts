import pokemonData from '../data/pokemon.json'

const data: { [key: string]: any } = pokemonData;

export class Pokemon {
    name: string;
    level: number;
    type1: string;
    type2?: string;
    iv: { [key: string]: number };

    HP: number;
    maxHP: number;
    attack: number;
    defense: number;
    speed: number;
    special: number;
    moves: string[];

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
        this.defense = Math.ceil((2 * data[name].base.defense + 2 * this.iv.defense) * (level / 100) + 5);
        this.speed = Math.ceil((2 * data[name].base.speed + 2 * this.iv.speed) * (level / 100) + 5);
        this.special = Math.ceil((2 * data[name].base.special + 2 * this.iv.special) * (level / 100) + 5);

        this.moves = [];
        data[name].moves.forEach((move: { name: string, level: number; }) => {
            if (move.level <= level) {
                this.moves.push(move.name);
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
moves: ${this.moves.join(', ')}`)
    }
}


// calculating stats - without effort
// For most stats: ( 2(base) + 2(genes) + (effort) ) * (level/100) + 5
// For HP: ( 2(base) + 2(genes) + (effort) ) * (level/100) + level + 10