const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('../game/gameConfig');

class Monk extends Character {
  constructor(name) {
    super(name);
  }

  // Heal special attack
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
