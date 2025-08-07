const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('../game/gameConfig');

class Fighter extends Character {
  constructor(name) {
    super(name);

    // Fighter-specific property for Dark Vision effect
    this.damageReduction = 0;
  }

  // Dark Vision special attack
  darkVision(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.darkVision;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Dark Vision")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Dark Vision", target.name));

    // Effect 1: "inflicting 5 damage"
    this.attack(target, 5);

    // Effect 2: "on next turn, will take 2 less damage per hit"
    this.damageReduction = 2;
    console.log(MESSAGES.EFFECTS.damageReduction(name));

    return true;
  }

  // Override takeDamage to handle damage reduction with special attack
  takeDamage(damage) {
    const { name, damageReduction } = this;

    // If damage reduction is active
    if (damageReduction > 0) {
      const reducedDamage = Math.max(0, damage - damageReduction);
      console.log(MESSAGES.EFFECTS.damageReduced(name, damage, reducedDamage));
      this.damageReduction = 0; // Reduction only works once

      // Call parent method with reduced damage
      super.takeDamage(reducedDamage);
    } else {
      // Normal behavior
      super.takeDamage(damage);
    }
  }

  // Display special effects for Fighter
  displaySpecialEffects() {
    const { damageReduction } = this;
    if (damageReduction > 0) {
      console.log(`  → Damage reduction: ${damageReduction} on next hit`);
    }
  }
}

module.exports = Fighter;
