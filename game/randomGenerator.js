const { CHARACTER_STATS } = require('./gameConfig');

const Fighter = require('../characters/fighter');
const Paladin = require('../characters/paladin');
const Monk = require('../characters/monk');
const Berzerker = require('../characters/berzerker');
const Assassin = require('../characters/assassin');
const Wizard = require('../characters/wizard');
const Valkyrie = require('../characters/valkyrie');

// Random name generator for characters
class RandomGenerator {
  static getRandomNames() {
    const names = [
      'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry',
      'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Pete',
      'Quinn', 'Ruby', 'Sam', 'Tara', 'Uma', 'Victor', 'Willow', 'Xander',
      'Yara', 'Zoe', 'Aria', 'Blake', 'Cora', 'Dean'
    ];

    // Shuffle and return first 5 unique names
    const shuffled = names.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  static getRandomClass() {
    const classes = Object.keys(CHARACTER_STATS);
    return classes[Math.floor(Math.random() * classes.length)];
  }

  static createCharacterByClass(name, className) {
    // Map class names to constructors
    const classMap = {
      Fighter,
      Paladin,
      Monk,
      Berzerker,
      Assassin,
      Wizard,
      Valkyrie
    };

    const ClassConstructor = classMap[className];
    if (!ClassConstructor) {
      throw new Error(`Unknown class: ${className}`);
    }

    return new ClassConstructor(name);
  }

  static generateRandomParty() {
    console.log("=== GENERATING RANDOM PARTY ===");

    const names = this.getRandomNames();
    const party = [];

    names.forEach((name, index) => {
      const className = this.getRandomClass();
      const character = this.createCharacterByClass(name, className);
      party.push(character);

      console.log(`${index + 1}. ${name} the ${className} joins the battle!`);
    });

    console.log("=== RANDOM PARTY COMPLETE ===\n");
    return party;
  }

  static generateBalancedParty() {
    console.log("=== GENERATING BALANCED PARTY ===");

    const names = this.getRandomNames();
    const classes = Object.keys(CHARACTER_STATS);
    const party = [];

    // Ensure we have one of each class if possible, then random for remaining
    names.forEach((name, index) => {
      const className = index < classes.length ? classes[index] : this.getRandomClass();
      const character = this.createCharacterByClass(name, className);
      party.push(character);

      console.log(`${index + 1}. ${name} the ${className} joins the battle!`);
    });

    console.log("=== BALANCED PARTY COMPLETE ===\n");
    return party;
  }
}

module.exports = RandomGenerator;
