const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('./gameConfig');

// Healer class extends Character
class Healer extends Character {
  constructor(name) {
    // Auto-configuration from gameConfig
    super(name);
  }

  // Mass Heal special attack - heals all living allies
  massHeal(allies) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.massHeal;
    
    // Check and consume mana
    if (!this.consumeMana(manaCost, "Mass Heal")) {
      return false;
    }
    
    console.log(MESSAGES.ATTACKS.massHeal(name));
    
    // Effect: "heal all living allies for 3 HP"
    let healedCount = 0;
    allies.forEach(ally => {
      if (!ally.isDead() && ally !== this) { // Don't heal self
        ally.heal(3);
        healedCount++;
      }
    });
    
    if (healedCount === 0) {
      console.log(`${name}'s Mass Heal had no valid targets!`);
    }
    
    return true;
  }
}

module.exports = Healer;