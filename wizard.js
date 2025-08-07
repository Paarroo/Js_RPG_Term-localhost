const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('./gameConfig');

// Wizard class extends Character
class Wizard extends Character {
  constructor(name) {
    // Auto-configuration from gameConfig
    super(name);
  }

  // Fireball special attack according to specs
  fireball(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.fireball;
    
    // Check and consume mana
    if (!this.consumeMana(manaCost, "Fireball")) {
      return false;
    }
    
    console.log(MESSAGES.ATTACKS.fireball(name, target.name));
    
    // Effect: "inflicting 7 damage"
    this.attack(target, 7);
    
    return true;
  }
}

module.exports = Wizard;