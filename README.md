# Pokemon
Gotta catch 'em all and <del>kill myself</del> become the happiest person in the world :3

---

## Info
This is a simple game, based on Pokémon Red (Game Freak, Nintendo, 1996).

You need to have node.js installed on your computer to run the game.
To start playing download this repo and write following commands in terminal:

```
npm install
npm run dev
```

The game contains some music, which your browser may turn off by default.

---

## Controls

| Keys | Function |
| :---: | --- |
| <kbd>W</kbd> <br> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> | movement, menu navigation |
| <kbd>Enter</kbd> | selecting menu options |
| <kbd>Esc</kbd> | exiting menus with no "cancel" option |
| <kbd>E</kbd> | opening menu with your Pokémon |

---

## About the game

### Gameplay
Enter your name and choose one of three starter Pokémon - Bulbasaur, Squirtle or Charmander. Then press „Enter” to begin an adventure. 

While exploring Viridian Forest and walking through high grass you may encounter a wild Pokémon. You can choose to leave it alone, engage in a fight or try to catch it.

### Pokémon 
There are currently 11 species of Pokémon, including 3 starting Pokémon which don’t appear in the wild. Each species has different base statistics and movesets.
Every individual Pokémon has its own statistics based on their species, level and genes (IV). Stats are calculated like in original game. 

At most you can have 6 Pokémon in your backpack. If your team is already full you’ll still be able to catch another Pokémon but unfortunately there is no possibillity to access it.

### Battles
Combat system is based on the actual game but it’s a bit simplified. It doesn’t include conditions like poisoning, burning or freezing another Pokémon. Effects of using a few moves are also modified. 

There are attacks that cause direct damage to the opponent (like Tackle or Scratch). Some of them also heal your Pokémon at the same time (eg. Absorb). Other attacks may lower enemy’s statistics (eg. Growl) or raise yours (eg. Growth).

Every attack and Pokémon species belong to one or two of a few types. That’s why some moves are more effective (double damage) or less effective (halved damage) on certain Pokémon. The attack also leads to more damage if its type is the same as the type of Pokémon's.

If you have more than one healthy Pokémon in your team you can switch them at anytime. After every fight resulting in defeating or catching a wild Pokémon, all your fighting and still healthy Pokémon will receive a certain amount of experience points. This allows them to level up, up to level 15. Your Pokémon will also heal automatically after the fight ends.

### Catching a Pokémon
The access to Poké Balls is unlimited. You can try to catch a Pokémon as many times as you want. There is a higher chance of catching a wild Pokémon if its health is lowered.

---

## To sum up
I think my Bulbasaur might have accidentally hit me with Sleep Powder or something.
The game may contain some bugs and by that I don’t mean these little cuties like Weedle or Caterpie.
If you’ve read up to this point than thank you and have fun playing! Also, have a nice day and a nice coffee :3

---

## Sources and resources
### Graphics and sounds
[Sprites](https://www.spriters-resource.com/game_boy_gbc/pokemonredblue/)
[Sounds](https://downloads.khinsider.com/game-soundtracks/album/pokemon-game-boy-pok-mon-sound-complete-set-play-cd)

### Information and mechanics
[Pokémon Database](https://pokemondb.net/)
[Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page)
[Stat calculator](https://pycosites.com/pkmn/stat_gen1.php)
[StrategyWiki - Pokémon Red moves](https://strategywiki.org/wiki/Pok%C3%A9mon_Red_and_Blue/Moves)
[The Cave of Dragonflies - capture mechanics](https://www.dragonflycave.com/mechanics/gen-i-capturing)
[Pokémon moves JSON](https://github.com/pcattori/pokemon/blob/master/pokemon/data/moves.json)

---

**POKÉMON**
**GOTTA CATCH 'EM ALL**