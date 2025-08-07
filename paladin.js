const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('./gameConfig');

class Paladin extends Character {
  constructor(name) {
    // Auto-configuration from gameConfig
    super(name);
  }

  // Healing Lightning special attack according to specs
  healingLightning(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.healingLightning;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Healing Lightning")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Healing Lightning", target.name));

    // Effect 1: "inflicting 4 damage"
    this.attack(target, 4);

    // Effect 2: "healing him for 5"
    this.heal(5);

    return true;
  }

}

module.exports = Paladin;
