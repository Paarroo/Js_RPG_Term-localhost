const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('../gameConfig');

class Valkyrie extends Character {
  constructor(name) {
    super(name);
  }

  // Missile Swarm special attack
  missileSwarm(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.missileSwarm;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Missile Swarm")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.missileSwarm(name, target.name));

    this.attack(target, 8);

    return true;
  }
}

module.exports = Valkyrie;
