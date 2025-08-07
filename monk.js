const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('./gameConfig');

// Monk class extends Character
class Monk extends Character {
  constructor(name) {
    // Auto-configuration from gameConfig
    super(name);
  }

  // Heal special attack according to specs
  heal() {
    const { name } = this;
    const manaCost = ABILITY_COSTS.heal;
    
    // Check and consume mana
    if (!this.consumeMana(manaCost, "Heal")) {
      return false;
    }
    
    console.log(MESSAGES.ATTACKS.usingNoTarget(name, "Heal"));
    
    // Effect: "rendering 8 hp"
    super.heal(8);
    
    return true;
  }

}

module.exports = Monk;