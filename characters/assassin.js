const Character = require('./character');
const { ABILITY_COSTS, MESSAGES } = require('../game/gameConfig');

class Assassin extends Character {
  constructor(name) {
    super(name);

    // Assassin-specific properties for Shadow Hit effect
    this.immuneNextTurn = false; // "not taking damage on next turn"
    this.shadowHitActive = false; // Track if shadow hit counter-attack is pending
  }

  // Shadow Hit special attack
  shadowHit(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.shadowHit;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Shadow Hit")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Shadow Hit", target.name));

    // Effect 1: "not taking damage on next turn"
    this.immuneNextTurn = true;
    console.log(MESSAGES.EFFECTS.immunity(name));

    // Effect 2: "special attack inflicting 7 damage"
    this.attack(target, 7);

    // Effect 3: "if opponent is not dead, assassin will lose 7 damage on his turn"
    if (!target.isDead()) {
      this.shadowHitActive = true;
      console.log(MESSAGES.EFFECTS.counterDamage(name, target.name));
    }

    return true;
  }

  // Override takeDamage to handle immunity
  takeDamage(damage) {
    const { name } = this;

    // If immune from Shadow Hit
    if (this.immuneNextTurn) {
      console.log(MESSAGES.EFFECTS.immuneToDamage(name));
      this.immuneNextTurn = false; // Immunity only works once
      return;
    }

    // Normal behavior
    super.takeDamage(damage);
  }

  // Method to apply Shadow Hit counter-damage (called by Game)
  applyShadowHitCounterDamage() {
    const { name } = this;

    if (this.shadowHitActive) {
      console.log(MESSAGES.EFFECTS.shadowCounter(name));
      this.shadowHitActive = false;
      // Use super.takeDamage to bypass immunity
      super.takeDamage(7);
    }
  }

  // Display special effects for Assassin
  displaySpecialEffects() {
    const { immuneNextTurn, shadowHitActive } = this;
    if (immuneNextTurn) {
      console.log(`  → Immune to damage on next turn`);
    }
    if (shadowHitActive) {
      console.log(`  → Will take 7 counter-damage`);
    }
  }
}

module.exports = Assassin;
