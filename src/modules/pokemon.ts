import pokemonData from '../data/pokemon.json'
import movesDataJSON from '../data/moves.json'
import typesData from '../data/types.json'

const data: { [key: string]: any } = pokemonData;
const movesData: { [key: string]: any } = movesDataJSON;
const types: { [key: string]: { [key: string]: number } } = typesData;

export class Pokemon {
    name: string;
    level: number;
    menuIcon: number;
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
        this.menuIcon = data[name].menuIcon;

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

    attackPokemon(target: Pokemon, moveName: string) {
        const move = movesData[moveName];
        console.log(move);
        target.printStats();

        if (Math.random() > move.accuracy) {
            return [`${this.name.toLocaleUpperCase()}'s attack missed!`];
        }

        if (move.category == "physical") {
            let A = this.attack;
            let D = target.defense;
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
                return [`${this.name.toLocaleUpperCase()}'s attack missed!`];
            }

            if (target.HP - damage < 0) {
                target.HP = 0;
            }
            else {
                target.HP -= damage;
            }
        }
        target.printStats();
    }
}


// calculating stats - without effort
// For most stats: ( 2(base) + 2(genes) + (effort) ) * (level/100) + 5
// For HP: ( 2(base) + 2(genes) + (effort) ) * (level/100) + level + 10