import { CHARACTER_STATS } from './gameConfig.js';
import {
  Fighter,
  Paladin,
  Monk,
  Berserker,
  Assassin,
  Wizard,
  Valkyrie
} from './characters/index.js';

export class RandomGenerator {
  static NAMES = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry',
    'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Pete',
    'Quinn', 'Ruby', 'Sam', 'Tara', 'Uma', 'Victor', 'Willow', 'Xander',
    'Yara', 'Zoe', 'Aria', 'Blake', 'Cora', 'Dean'
  ];

  static fisherYatesShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static getRandomNames(count = 5) {
    if (count > this.NAMES.length) {
      throw new Error(`Cannot generate ${count} unique names, only ${this.NAMES.length} available`);
    }
    
    const shuffled = this.fisherYatesShuffle(this.NAMES);
    return shuffled.slice(0, count);
  }

  static getRandomClass() {
    const classes = Object.keys(CHARACTER_STATS);
    return classes[Math.floor(Math.random() * classes.length)];
  }

  static getRandomClasses(count, maxDuplicates = 1) {
    const allClasses = Object.keys(CHARACTER_STATS);
    const result = [];
    const classCount = {};
    
    while (result.length < count) {
      const randomClass = allClasses[Math.floor(Math.random() * allClasses.length)];
      const currentCount = classCount[randomClass] || 0;
      
      if (currentCount < maxDuplicates) {
        result.push(randomClass);
        classCount[randomClass] = currentCount + 1;
      }
    }
    
    return result;
  }

  static getBalancedClasses(count) {
    const allClasses = Object.keys(CHARACTER_STATS);
    const shuffledClasses = this.fisherYatesShuffle(allClasses);
    
    if (count <= allClasses.length) {
      return shuffledClasses.slice(0, count);
    }
    
    const result = [...shuffledClasses];
    const remaining = count - allClasses.length;
    
    for (let i = 0; i < remaining; i++) {
      result.push(allClasses[i % allClasses.length]);
    }
    
    return this.fisherYatesShuffle(result);
  }

  static createCharacterByClass(name, className) {
    const classMap = {
      Fighter,
      Paladin,
      Monk,
      Berserker,
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

  static generateRandomParty(count = 5) {
    console.log("=== GENERATING RANDOM PARTY ===");

    const names = this.getRandomNames(count);
    const classes = this.getRandomClasses(count, 2);
    const party = [];

    for (let i = 0; i < count; i++) {
      const character = this.createCharacterByClass(names[i], classes[i]);
      party.push(character);
      console.log(`${i + 1}. ${names[i]} the ${classes[i]} joins the battle!`);
    }

    console.log("=== RANDOM PARTY COMPLETE ===\n");
    return party;
  }

  static generateBalancedParty(count = 5) {
    console.log("=== GENERATING BALANCED PARTY ===");

    const names = this.getRandomNames(count);
    const classes = this.getBalancedClasses(count);
    const party = [];

    for (let i = 0; i < count; i++) {
      const character = this.createCharacterByClass(names[i], classes[i]);
      party.push(character);
      console.log(`${i + 1}. ${names[i]} the ${classes[i]} joins the battle!`);
    }

    console.log("=== BALANCED PARTY COMPLETE ===\n");
    return party;
  }
}

export default RandomGenerator;